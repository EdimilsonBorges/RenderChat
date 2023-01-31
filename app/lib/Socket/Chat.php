<?php

namespace App\Socket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected $clients;
    protected $userIdChat;
    private $users = [];
    private $messages;
    private $onlines = [];

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
        $this->userIdChat = $conn->resourceId;
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {

        $msg = json_decode($msg, true);

        if (isset($msg['message'])) {

            $this->messages = [
                'message' => $msg['message'],
                'userId' => $msg['userId'],
                'userIdChat' => $from->resourceId,
                'fromId' => $msg['fromId'],
                'name' => $msg['name'],
                'photo' => $msg['photo'],
            ];

            foreach ($this->clients as $client) {


                foreach ($this->users as $key => $user) {

                    if (($user == $this->messages['fromId']) || ($user == $this->messages['userId'])) {
                        if ($key == $client->resourceId) {
                            $msg = json_encode($this->messages, true);
                            $client->send($msg);
                        }
                    }
                }
            }
        } else {

            $this->users += [
                $this->userIdChat => $msg['userId']
            ];



            if (!in_array($msg['userId'], $this->onlines)) {
                array_push($this->onlines, $msg['userId']);
            }

            print_r($this->users);
            print_r($this->onlines);

            foreach ($this->clients as $client) {
                $client->send(json_encode($this->onlines, true));
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {

        $key = array_search($this->users[$conn->resourceId], $this->onlines); // pesquisa o id corrente dentro do array dos ids

        unset($this->users[$conn->resourceId]);  // remove o id corrente dentro do array dos ids
        echo "Connection {$conn->resourceId} has disconnected\n";

        if ($key !== false) { // verifica se existe algum registro

            if (!in_array($this->onlines[$key], $this->users)) { // verifica se o id ainda existe no array
                unset($this->onlines[$key]); // se não existir mais remove o id
            }
        }

        print_r($this->users);
        print_r($this->onlines);

        foreach ($this->clients as $client) {
            $client->send(json_encode($this->onlines, true));
        }

        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
