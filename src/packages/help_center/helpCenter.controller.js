const AWS = require("aws-sdk")
const Config = require('../../configs')
const _ = require('lodash')

AWS.config.update({
    region: 'us-east-1'
});

const ses = new AWS.SES()

const inquire = async (req, res) => {
    try{
        let email = req.body.email
        let message = req.body.message

        let emailBody = `
            <!DOCTYPE  html>
                <head></head>
                <body lang="en">
                <dl>
                    <dt>Email: ${email}</dt>
                    <dd>Message: ${message}</dd>
                </dl>
                </body>
            </html>
        `;

        await sendEmail({to: Config.EMAIL_RECEIVER, from: email}, "Help Center", emailBody)

        return res.status(200).json({
            email: "send successful"
        });
    }catch(err){
        return res
        .status(400)
        .json(err)
    }
}

const sendEmail = (addressParam, subject, body) => {
    let _self = this;
    let processedSubject = 'No Subject';

    return new Promise((resolve, reject) => {

        if(!_.isEmpty(subject)){
            processedSubject = subject
        }

        const params = {
            Destination: {
                ToAddresses: (Array.isArray(addressParam.to)) ? addressParam.to : (!_.isEmpty(addressParam.to)) ? [addressParam.to] : [],
                CcAddresses: (Array.isArray(addressParam.cc)) ? addressParam.cc : (!_.isEmpty(addressParam.cc)) ? [addressParam.cc] : [] ,
                BccAddresses: (Array.isArray(addressParam.bcc)) ? addressParam.bcc : (!_.isEmpty(addressParam.bcc)) ? [addressParam.bcc] : [] 
            },
            Message: {
                Body: {
                    Html: {
                        Data: body
                    }
                },
                Subject: {
                    Data: processedSubject
                }
            },
            Source: addressParam.from,
            ReplyToAddresses: [addressParam.from]
        };

        console.log(params)

        ses.sendEmail(params, (err, result) => {
            
            if(err){
                console.error(err)
                reject(err)

            }else{
                resolve(result)
            }

        })
    })
}

module.exports = {
    inquire
}