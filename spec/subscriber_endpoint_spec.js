describe("Subscriber Endpoint", function() {

  describe("non-GET requests", function() {
    it("should respond with a 405 Method Not Allowed status code.", function() {
      startServer();
      var received = false;
      put('http://0.0.0.0:8080/rt', '', function(response) {
        expect(response.statusCode).toEqual(405);
      });
      post('http://0.0.0.0:8080/rt', '', function(response) {
        expect(response.statusCode).toEqual(405);
      });
      del('http://0.0.0.0:8080/rt', '', function(response) {
        expect(response.statusCode).toEqual(405);
      });
    });
  });

});