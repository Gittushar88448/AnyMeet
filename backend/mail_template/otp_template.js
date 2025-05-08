const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.otp {
				font-size: 22px;
				font-weight: bold;
				background-color: #f3f3f3;
				padding: 10px;
				display: inline-block;
				border-radius: 5px;
				user-select: all;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<a href="https://zoomclone.example.com">
				<img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Zoom Clone Logo">
			</a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>To complete your verification, please use the following OTP (One-Time Password):</p>
				<div class="otp">${otp}</div>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please ignore this email.</p>
			</div>
			<div class="support">
				If you need assistance, contact us at 
				<a href="mailto:support@zoomclone.com">support@zoomclone.com</a>.
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = otpTemplate;
