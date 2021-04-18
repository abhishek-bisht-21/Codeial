const nodemailer = require('../config/nodemailer');

// This is another way of exporting method
exports.newComment = (comment) => {

    // Telling Nodemailer that we are going to use this particular Template
    let htmlString = nodemailer.renderTemplate({comment:comment}, '/comments/new_comments.ejs');

    nodemailer.transporter.sendMail({
        from : 'no-reply@insta.com',
        to : comment.user.email,
        subject : "New Comment Published !",
        html : htmlString
    }, (err,info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log("Message Sent", info);
        return ;
    })
}