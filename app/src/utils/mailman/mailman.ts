import mail, { MailService } from "@sendgrid/mail"

export class Mailman {

    private api_key: string
    private fromMail: string
    private mailService: MailService
    private log: boolean

    constructor(apiKey: string, fromMail: string, log: boolean = false) {
        this.api_key = apiKey
        this.fromMail = fromMail
        this.mailService = mail
        this.log = log

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
            }).catch(error => {
                if (this.log) console.log("Error when trying to deliver unique mail: ", error);
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
            }).catch(error => {
                if (this.log) console.log("Error when trying to deliver mails: ", error);
            })
    }
}
