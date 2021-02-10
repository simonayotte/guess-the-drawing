import axios from 'axios';
// tslint:disable-next-line:no-require-imports
import FormData = require('form-data');
import { injectable } from 'inversify';

// URL
const MAIL_SERVER_URL = 'https://log2990.step.polymtl.ca/email';

// METHODS
const POST = 'post';

// API PARAMETERS
const PAYLOAD_KEY = 'payload';
const TO_KEY = 'to';

// HEADERS
const CONTENT_TYPE_VALUE = 'multipart/form-data';
const TEAM_KEY_VALUE = '035ce567-a74e-4925-8c2a-721d6ac5579e';

// DATA
const IMAGE_DATA_SEPARATOR = ',';
const IMAGE_ENCODING = 'base64';

const EMAIL_REGEX = /^[\w\-\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

@injectable()
export class EmailService {
    async sendMail(base64Data: string, email: string, fileName: string, imageType: string): Promise<string | void> {
        const bodyFormData = this.getMailBody(base64Data, email, fileName, imageType);

        if (!this.validateEmail(email)) {
            return Promise.reject('Error');
        }

        return this.sendMailRequest(bodyFormData).then(
            async () => {
                return Promise.resolve('Success');
            }
        ).catch(async () => {
            return Promise.reject('Error');
        });
    }

    b64toBlob(dataURI: string): Buffer {
        return Buffer.from(dataURI.split(IMAGE_DATA_SEPARATOR)[1], IMAGE_ENCODING);
    }

    getMailBody(base64Data: string, email: string, fileName: string, imageType: string): FormData {
        const bodyFormData = new FormData();
        bodyFormData.append(TO_KEY, email);
        bodyFormData.append(PAYLOAD_KEY, this.b64toBlob(base64Data), {contentType: imageType, filename: fileName});
        return bodyFormData;
    }

    validateEmail(email: string): boolean {
        const regex = new RegExp(EMAIL_REGEX);
        return regex.test(email);
    }

    async sendMailRequest(bodyFormData: FormData): Promise<void | number> {
        return axios({
            method: POST,
            url: MAIL_SERVER_URL,
            data: bodyFormData,
            headers: {
                'Content-Type': CONTENT_TYPE_VALUE,
                'X-Team-Key': TEAM_KEY_VALUE,
                ...bodyFormData.getHeaders()
            }
        }).then((response) => {
            return response.status;
        }, async (error) => {
            return Promise.reject(error);
        });
    }
}
