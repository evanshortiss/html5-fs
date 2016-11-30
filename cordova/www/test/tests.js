'use strict';

(function() {
  var fs = window.fs;

  var expect = window.expect || window.chai.expect;

  // Should probably use the standard fs API
  function wipeLocalFiles (done) {

    function wipeDir (entry, callback) {
      if (entry.isFile) {
        fs.unlink(entry.fullPath, callback);
      } else {
        fs.readdir(entry.fullPath, function (err, list) {
          if (err) {
            return callback(err);
          }

          async.each(list, wipeDir, callback);
        });
      }
    }

    fs.readdir('./', function (err, flist) {
      expect(err).to.equal(null);
      async.each(flist, wipeDir, done);
    });
  }

  before(function(done) {
    this.timeout(30000);

    fs.init(10 * 1024 * 1024, function(err) {
      expect(err).to.equal(null);
      wipeLocalFiles(done);
    });
  });

  describe('HTML5 FileSystem Wrapper (fs)', function() {
    this.timeout(20000);

    var TEST_FILE_PATH = 'file.txt',
      TEST_MKDIR_PATH = 'testdir',
      TEST_FILE_TEXT = 'Hello World';

    function writeDefaultFile(done) {
      fs.writeFile(TEST_FILE_PATH, TEST_FILE_TEXT, done);
    }

    function deleteTestFile(done) {
      fs.unlink(TEST_FILE_PATH, function(/*err*/) {
        // Ignore error, file might not exist
        done();
      });
    }

    beforeEach(deleteTestFile);

    describe('#writeFile', function() {
      it('Should write a file successfully without returning an error.', function(done) {
        writeDefaultFile(function(err) {
          expect(err).to.equal(null);
          done(err);
        });
      });
    });

    describe('#exists', function() {
      it('Should return false.', function(done) {
        fs.exists('somefakepathimadeuplike', function(exists) {
          expect(exists).to.equal(false);
          done();
        });
      });

      it('Should return true.', function(done) {
        writeDefaultFile(function(/*err, path*/) {
          fs.exists(TEST_FILE_PATH, function(exists) {
            expect(exists).to.equal(true);
            done();
          });
        });
      });
    });

    describe('#appendFile', function() {

      it('Should append text to an existing file.', function(done) {
        writeDefaultFile(function(err) {
          expect(err).to.equal(null);

          fs.appendFile(TEST_FILE_PATH, TEST_FILE_TEXT, function(err) {
            expect(err).to.equal(null);

            fs.readFile(TEST_FILE_PATH, {
              encoding: 'utf8',
            }, function(err, data) {
              expect(err).to.equal(null);
              expect(data).to.equal(TEST_FILE_TEXT + TEST_FILE_TEXT);

              done(err);
            });
          });
        });
      });
    });


    describe('#readdir', function() {
      it('Should write a file and list.', function(done) {
        writeDefaultFile(function(err/*, path*/) {
          expect(err).to.equal(null);

          fs.readdir('./', function(err, flist) {
            expect(err).to.equal(null);
            expect(flist).to.be.an('array');
            expect(flist.length).to.be.at.least(1);

            done(err);
          });
        });
      });
    });

    describe('#mkdir', function() {
      function rm(done) {
        fs.rmdir(TEST_MKDIR_PATH, function () {
          done();
        });
      }

      before(rm);
      after(rm);

      it('Should create a directory successfully', function(done) {
        fs.mkdir(TEST_MKDIR_PATH, function(err) {
          expect(err).to.equal(null);
          done(err);
        });
      });
    });

    describe('#rmdir', function() {
      it('Should delete a created directory.', function(done) {
        fs.mkdir(TEST_MKDIR_PATH, function(err/*, path*/) {
          expect(err).to.equal(null);

          fs.rmdir(TEST_MKDIR_PATH, function(err) {
            expect(err).to.equal(null);
            done(err);
          });
        });
      });

      it('Should try delete a file and fail as we provide a filepath, not a directory.', function(done) {
        writeDefaultFile(function(err) {
          expect(err).to.equal(null);

          fs.rmdir(TEST_FILE_PATH, function(rmerr) {
            expect(rmerr).to.not.equal(null);
            done();
          });
        });
      });

      // TODO: Testing delete a nested directory
    });

    describe('#readFile', function() {

      it('Should read a file that was written, as plaintext.', function(done) {
        writeDefaultFile(function(/*err*/) {

          fs.readFile(TEST_FILE_PATH, function(err, data) {
            expect(err).to.equal(null);
            expect(data).to.be.a('string');
            expect(data).to.equal(TEST_FILE_TEXT);
            done(err);
          });
        });
      });

      it('Should read a file that was written, as data.', function(done) {
        writeDefaultFile(function(err) {
          expect(err).to.equal(null);

          fs.readFile(TEST_FILE_PATH, {
            opts: 'base64'
          }, function(err, data) {
            expect(err).to.equal(null);
            expect(data).to.be.a('string');
            expect(data).to.equal('data:text/plain;base64,SGVsbG8gV29ybGQ=');
            done(err);
          });
        });
      });
    });

    describe('#unlink', function(done) {
      it('Should delete a test file.', function() {
        writeDefaultFile(function(err) {
          expect(err).to.equal(null);

          fs.unlink(TEST_FILE_PATH, function(err) {
            expect(err).to.equal(null);

            fs.readFile(TEST_FILE_PATH, function(err, data) {
              expect(err).to.equal(null);

              // No file so no data exists!
              expect(data).to.equal(null);

              done();
            });
          });
        });
      });
    });

  });

})();
