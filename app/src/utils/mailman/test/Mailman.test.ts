import path from "path";
import { Mailman } from "../mailman";
import dotenv from 'dotenv';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

test("Send an email", async () => {
    dotenv.config({
        path: path.join(__dirname, "..", ".env")
    })

    let mailman = new Mailman(process.env.API_KEY || "we are doomed to fail", process.env.MAIL || "test@test.com", true)
    try {
        await mailman.sendMail("borrasexposito@gmail.com", "Test jest", "Hello!")
        await delay(8000)
        expect(true)
    } catch (e) {
        expect(false)
    }
}, 100000)

test("Send multiple emails", async () => {
    dotenv.config({
        path: path.join(__dirname, "..", ".env")
    })

    let mailman = new Mailman(process.env.API_KEY || "we are doomed to fail", process.env.MAIL || "test@test.com", true)
    try {
        await mailman.sendMultipleMails(["borrasexposito@gmail.com"], "Test jest", "Hello!")
        await delay(8000)
        expect(true)
    } catch (e) {
        expect(false)
    }
}, 100000)