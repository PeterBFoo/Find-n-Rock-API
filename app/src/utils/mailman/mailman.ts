import mail, { MailService } from "@sendgrid/mail"

export class Mailman {

    private api_key: string
    private fromMail: string
    private mailService: MailService

    constructor(apiKey: string, fromMail: string) {
        this.api_key = apiKey
        this.fromMail = fromMail
        this.mailService = mail

        this.mailService.setApiKey(this.api_key);
    }
    /**
     * 
     * @param receiver The email that will recieve the mail
     * @param affair 
     * @param content HTML content that mail will contain
     * @param _await True if you want to wait until mail is sent
     */
    async sendMail(receiver: string, affair: string, content: string) {
        let message = {
            to: receiver,
            from: this.fromMail,
            subject: affair,
            html: content,
        };

        this.mailService.send(message)
            .then(() => {
                console.log("Email sent successfully")
            }).catch(error => {
                console.log(error);
            })
    }

    async sendMultipleMails(receivers: string[], affair: string, content: string) {
        let message = {
            to: receivers,
            from: this.fromMail,
            subject: affair,
            html: content,
        };

        this.mailService.sendMultiple(message)
            .then(() => {
                console.log("Emails sent successfully")
            }).catch(error => {
                console.log(error);
            })
    }
}
