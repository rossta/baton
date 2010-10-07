require 'spec_helper'

describe "subscriber endpoint" do
  
  context "non-GET requests" do
    it "should respond with a 405 Method Not Allowed status code." do
      begin
        start_server
        put('http://0.0.0.0:8080/rt', '').code.to_i.should == 405
        post('http://0.0.0.0:8080/rt', '').code.to_i.should == 405
        del('http://0.0.0.0:8080/rt').code.to_i.should == 405
      ensure
        stop_server
      end
    end
  end
  
  context "while waiting for a message" do
    context "when the channel is deleted" do
      it "should unsubscribe the client" do
        begin
          start_server
          put('/publish/42')
          
          client, listener = new_client_and_listener
          subscribe("42", client, listener)

          delete('/publish/42')

          listener.wait_for_unsubscribed(client, '42', 'CHANNEL DELETED')
        ensure
          stop_server
        end
      end
    end
  end
  
  context "when a message exists" do
    it "should send the message after connecting" do
      begin
        start_server({:store_messages => true, :max_messages => 5})
        post('/publish/42', "Hi, Mom!")
        client, listener = new_client_and_listener
        subscribe("42", client, listener)
        listener.wait_for_message(client, /Hi, Mom\!/)
      ensure
        stop_server
      end
    end
  end
    
  context "with custom subscribe endpoint" do
    it "should respond with 200 and the message" do
      begin
        start_server({:store_messages => true, :max_messages => 5, :subscribe_socket_io_resource => 'custom'})
        post('/publish/42', "Hi, Mom!")
        listener = MessageListener.new
        client = BatonClient.new("ws://0.0.0.0:8080/custom/websocket", listener)
        subscribe('42', client, listener)
        listener.wait_for_message(client, /Hi, Mom\!/)
      ensure
        stop_server
      end
    end
  end
end