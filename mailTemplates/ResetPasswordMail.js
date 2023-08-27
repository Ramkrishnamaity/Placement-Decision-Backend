exports.resetPasswordMail = (url, name) => {
    return `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>Password Update Confirmation</title>
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
      
              .support {
                  font-size: 14px;
                  color: #999999;
                  margin-top: 20px;
              }
      
              .highlight {
                  font-weight: bold;
              }
          </style>
      
      </head>
      
      <body>
          <div class="container">
              <a href="#"><img class="logo"
                      src="https://res.cloudinary.com/dtguuc4py/image/upload/v1693050712/PlacementDecision/companyLogo/ov0o6cev3zuwhv3c4ztw.png" alt="Logo"></a>
              <div class="message">Reset password Mail</div>
              <div class="body">
                  <p>Hey ${name},</p>
                  <p>Your Link for email verification is ${url}. Please click this url to reset your password.
                  </p>
                  <p>If you did not request this, just ignore.</p>
              </div>
              <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                  at
                  <a href="mailto:info@placementdecision.com">info@placementdecision.com</a>. We are here to help!
              </div>
          </div>
      </body>
      
      </html>`;
  };
  