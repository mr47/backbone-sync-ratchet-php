<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

$globalTestObject = "";

class Chat implements MessageComponentInterface {
    protected $clients;
    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        //load default value or get from db
        $conn->testObject = json_decode('{"name":"Dmitry","age":"22","lang":"en"}');

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $message = json_decode($msg);

        if (isset($message)){
              echo ($message->command)."(".$from->resourceId.") > ";
            if ($message->command=="read"){
                echo "reading data ... \n";
                $from->testObject->success = true;
                $from->send(json_encode($from->testObject));

            }

            if ($message->command=="create"){
              echo "set data ...\n";
              $from->testObject = $message->data; // someting like update in db
              //$globalTestObject = $message->data;
              $from->testObject->success = true;
              $from->send(json_encode($message->data));
            }
       }

       /* its send to all clients recived message
        $numRecv = count($this->clients) - 1;

        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
            }
        }
        */
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
