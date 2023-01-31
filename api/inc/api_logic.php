<?php

class api_logic
{
    private $params;
    private $endpoint;

    public function __construct($endpoint, $params = null)
    {
        $this->params = $params;
        $this->endpoint = $endpoint;
    }

    public function endpoint_exists()
    {
        return method_exists($this, $this->endpoint);
    }

    public function status()
    {
        return [
            'status' => 'SUCESS',
            'message' => 'A api está rodando normal',
        ];
    }

    public function error_response($mensage)
    {
        return [
            'status' => 'ERROR',
            'message' => $mensage,
            'results' => [],
        ];
    }

    public function sucess_response($mensage, $results = [])
    {
        return [
            'status' => 'SUCESS',
            'message' => $mensage,
            'results' => $results,
        ];
    }

    public function create_new_user()
    {
        $db = new database();

        if (
            !isset($this->params['first_name']) ||
            !isset($this->params['last_name']) ||
            !isset($this->params['email']) ||
            !isset($this->params['pass']) ||
            !isset($this->params['date_nasc']) ||
            !isset($this->params['genre']) ||
            !isset($this->params['confirm_email'])
        ) {
            return $this->error_response('Os dados do cadastro estão incompletos');
        }

        $params = [
            ':email' => $this->params['email'],
        ];

        $results = $db->select('SELECT email FROM users WHERE email = :email', $params);

        if (count($results) != 0) {
            return $this->error_response('Já existe um usuário com o mesmo e-mail');
        }

        $params = [
            ':first_name' => $this->params['first_name'],
            ':last_name' => $this->params['last_name'],
            ':email' => $this->params['email'],
            ':pass' => $this->params['pass'],
            ':date_nasc' => $this->params['date_nasc'],
            ':genre' => $this->params['genre'],
            ':confirm_email' => $this->params['confirm_email'],
        ];

        $db->insert('INSERT INTO users VALUES(
            0, 
            :first_name, 
            :last_name, 
            :email,
            :pass, 
            :date_nasc, 
            :genre,
            :confirm_email,
            NOW(),
            NULL,
            NULL)', $params);

        return $this->sucess_response('Cadastro completado com sucesso!!!');
    }

    public function total_comments()
    {
        $db = new database();

        $params = [
            ':posts_id' => $this->params['posts_id'],
        ];

        $results = $db->select("SELECT posts_id, COUNT(*) Comments FROM comments WHERE posts_id = :posts_id", $params);
        return $this->sucess_response('',$results);
    }

    public function total_likes()
    {
        $db = new database();

        $params = [
            ':post_id' => $this->params['post_id'],
        ];

        $results = $db->select("SELECT post_id, COUNT(*) Likes FROM likes WHERE post_id = :post_id", $params);
        return $this->sucess_response('',$results);
    }

    public function total_user_active()
    {
        $db = new database();
        $results = $db->select("SELECT 'Usuarios', COUNT(*) Total FROM users WHERE deleted_at IS NULL");
        return $this->sucess_response('',$results);
    }
    public function total_user_inactive()
    {
        $db = new database();
        $results = $db->select("SELECT 'Usuarios', COUNT(*) Total FROM users WHERE deleted_at IS NOT NULL");
        return $this->sucess_response('',$results);
    }

    public function update_user()
    {
        $db = new database();


        if (
            !isset($this->params['id']) ||
            !isset($this->params['first_name']) ||
            !isset($this->params['last_name']) ||
            !isset($this->params['email']) ||
            !isset($this->params['date_nasc']) ||
            !isset($this->params['genre'])
        ) {
            return $this->error_response('Os dados do cadastro estão incompletos');
        }


        $params = [
            ':id' => $this->params['id'],
            ':email' => $this->params['email'],
        ];

        $results = $db->select('SELECT id FROM users WHERE email = :email AND id = :id AND deleted_at IS NULL', $params);

        if (count($results) == 0) {
            return $this->error_response('Este usuário não pode se editado');
        }

        $params = [
            'id' => $this->params['id'],
            ':first_name' => $this->params['first_name'],
            ':last_name' => $this->params['last_name'],
            ':email' => $this->params['email'],
            ':date_nasc' => $this->params['date_nasc'],
            ':genre' => $this->params['genre'],
        ];

        $db->update('UPDATE users SET
            first_name = :first_name, 
            last_name = :last_name, 
            email = :email,
            date_nasc = :date_nasc, 
            genre = :genre,
            modified_at = NOW()
            WHERE id = :id', $params);

        return $this->sucess_response('Usuário atualizado com sucesso!!!');
    }

    public function get_all_users()
    {
        $db = new database();
        $results = $db->select('SELECT * FROM users');

        return $this->sucess_response("", $results);
    }

    public function get_all_users_active()
    {
        $db = new database();
        $results = $db->select('SELECT * FROM users WHERE deleted_at IS NULL');

        return $this->sucess_response("", $results);
    }

    public function get_all_users_inactive()
    {
        $db = new database();
        $results = $db->select('SELECT * FROM users WHERE deleted_at IS NOT NULL');

        return $this->sucess_response("", $results);
    }

    public function soft_delete_users()
    {
        $db = new database();

        if (!isset($this->params['id'])) {
            return $this->error_response('O usuário não foi encontrado');
        }

        $params = [
            ':id' => $this->params['id'],
        ];

        $results = $db->select('SELECT id, deleted_at FROM users WHERE id = :id', $params);


        if (count($results) == 0) {
            return $this->error_response('O usuário não foi encontrado');
        }

        $db->update('UPDATE users SET deleted_at = NOW() WHERE id = :id', $params);
        return $this->sucess_response("O usuário foi desativado com sucesso!!!");
    }

    public function soft_restore_users()
    {
        $db = new database();

        if (!isset($this->params['id'])) {
            return $this->error_response('O usuário não foi encontrado');
        }

        $params = [
            ':id' => $this->params['id'],
        ];

        $results = $db->select('SELECT id FROM users WHERE id = :id', $params);

        if (count($results) == 0) {
            return $this->error_response('O usuário não foi encontrado');
        }

        $db->update('UPDATE users SET deleted_at = NULL WHERE id = :id', $params);
        return $this->sucess_response("O usuário foi ativado com sucesso!!!");
    }

    public function delete_users()
    {
        $db = new database();

        if (
            !isset($this->params['id'])
        ) {
            return $this->error_response('O usuário não foi encontrado');
        }

        $params = [
            ':id' => $this->params['id'],
        ];

        $results = $db->select('SELECT id FROM users WHERE id = :id', $params);

        if (count($results) == 0) {
            return $this->error_response('O usuário não foi encontrado');
        }


        $db->delete('DELETE FROM users WHERE id = :id', $params);

        return $this->sucess_response("O usuário foi eliminado com sucesso!!!");
    }


    public function get_all_posts()
    {
        $db = new database();
        $results = $db->select('SELECT * FROM posts');

        return $this->sucess_response("", $results);
    }
}
