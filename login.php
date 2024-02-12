<?php 
session_start();
if (isset($_GET["gameid"])) {
    $gameId = htmlspecialchars($_GET["gameid"]);
    $_SESSION["gameId"] = $gameId;
}
?>
<html>
<head>
    <title>Login</title>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="icon" href="gomoku.ico" sizes="16x16 32x32 48x48 64x64">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: monospace, sans-serif;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: url("login.jpg") no-repeat;
            background-size: cover;
            background-position: center;
        }

        main img {
            position: relative;
            left: 50%;
            transform: translate(-50%);
            margin-bottom: 10px;
        }

        .register_form {
            width: 420px;
            background: transparent;
            color: #000;
            border-radius: 10px;
            padding: 30px 40px;
            border: 3px solid rgba(255, 255, 255, .3);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 0 10px rgba(0, 0, 0, .1);
            z-index: 10;
        }

        .register_form h1 {
            font-size: 36px;
            text-align: center;
        }

        .register_form .input_box {
            width: 100%;
            height: 50px;
            margin: 30px 0;
        }

        .input_box input {
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.3);
            border: none; 
            outline: none;
            border: 2px solid rgba(255, 255, 255, .2);
            border-radius: 40px; 
            font-size: 16px;   
            color: #000;
            padding: 20px 45px 20px 20px;
        }

        .input_box input:focus {
            border: 2px solid #3258a8;
        }

        .input_box input::placeholder {
            color: #000;
        }

        .input_box i {
            position: absolute;
            right: 20px;
            font-size: 20px;
            margin: 15px 30px 0 0;
        }

        .register_form .register_button {
            width: 100%;
            height: 45px;
            background: #fff;
            border: none;
            outline: none;
            border-radius: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .1);
            cursor: pointer;
            font-size: 16px;
            color: #333;
            font-weight: 600;
        }

        .register_form .login_link {
            font-size: 14.5px;
            text-align: center;
            margin: 20px 0 15px;
        }

        .login_link p a {
            text-decoration: none;
            font-weight: 600;
        }

        .login_link p a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <main>
        <div class="register_form">
            <form action="user_login.php" method="POST">
                <h1>Gomoku Login</h1>
                <div class="input_box">
                    <input type="text" placeholder="Username" name="username" id="username" required>
                    <i class='bx bxs-user'></i>
                </div>
                <div class="input_box">
                    <input type="password" placeholder="Password" name="password" required>
                    <i class='bx bxs-lock-alt'></i>
                </div>

                <button type="submit" class="register_button">Login</button>

                <div class="login_link">
                    <p>Don't have an account yet? <a id="register">Register</a>!</p>
                </div>
            </form>
        </div>
    </main>
    <script>
        document.getElementById("username").focus();
        const gameId = <?php echo "\"" . $gameId . "\";\r\n"; ?>
        document.getElementById("register").href = "register.php" + (gameId == "" ? "" : "?gameid=" + gameId);
    </script>
    <?php 
    if (isset($_GET["error"])) {
        echo "<script>";
        echo "alert('Wrong password or username. Please try again.')";
        echo "</script>";
        
        $url = "login.php";   
        echo "<script>";  
        echo "window.location.href='$url'";  
        echo "</script>";  
    } 
    ?>
</body>
</html>