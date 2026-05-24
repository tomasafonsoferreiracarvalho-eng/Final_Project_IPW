<?php
$host = "localhost";
$utilizador = "root";
$password = "";
$base_dados = "biblioteca_jogos";

$conn = mysqli_connect($host, $utilizador, $password, $base_dados);

if (!$conn) {
    die("Erro de ligação: " . mysqli_connect_error());
}

$nome = $_POST["nome"];
$email = $_POST["email"];
$mensagem = $_POST["mensagem"];

$sql = "INSERT INTO contactos (nome, email, mensagem) VALUES ('$nome', '$email', '$mensagem')";

if (mysqli_query($conn, $sql)) {
    header("Location: http://localhost/Final_Project_IPW/Final_Project_IPW/index.html?enviado=1");
} else {
    header("Location: http://localhost/Final_Project_IPW/Final_Project_IPW/index.html?erro=1");
}

mysqli_close($conn);
?>