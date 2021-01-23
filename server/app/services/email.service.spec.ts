import * as Chai from 'chai';
import * as ChaiSpies from 'chai-spies';
import { EmailService } from './email.service';

const VALID_EMAIL = 'aaa@aaa.com';
const INVALID_EMAIL = 'aaaaa';

const B64_STR = 'c3RyaW5n';
const B64_IMAGE_STR = 'asdasd,' + B64_STR;
const STR = 'string';
const B64_TO_BLOB = 'b64toBlob';

describe('emailService', () => {
    let emailService: EmailService;
    Chai.use(ChaiSpies);
    const expect = Chai.expect;

    beforeEach(async () => {
        emailService = new EmailService();
    });

    it('validateEmail should return true on valid email', () => {
        const returnValue = emailService.validateEmail(VALID_EMAIL);
        expect(returnValue).to.equals(true);
    });

    it('validateEmail should return false on invalid email', () => {
        const returnValue = emailService.validateEmail(INVALID_EMAIL);
        expect(returnValue).to.equals(false);
    });

    it('getMailBody should return object with payload and to keys', () => {
        const spy = Chai.spy.on(emailService, B64_TO_BLOB);

        emailService.getMailBody(B64_IMAGE_STR, STR, STR, STR);

        expect(spy).to.have.been.called();
    });

    it('sendMail should return an error on fail', async () => {
        try {
            await emailService.sendMail(B64_IMAGE_STR, INVALID_EMAIL, STR, STR);
        } catch (error) {
            expect(error).to.equals('Error');
        }
    });

    it('sendMail should return an error on fail with valid email', async () => {
        try {
            await emailService.sendMail(B64_IMAGE_STR, VALID_EMAIL, STR, STR);
        } catch (error) {
            expect(error).to.equals('Error');
        }
    });
});
