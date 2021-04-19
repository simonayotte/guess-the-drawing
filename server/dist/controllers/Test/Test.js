"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const CrudController_1 = require("../CrudController");
class TestController extends CrudController_1.CrudController {
    create(req, res) {
        throw new Error("Method not implemented.");
    }
    read(req, res) {
        res.json({ message: 'GET /user request received ' });
    }
    update(req, res) {
        throw new Error("Method not implemented.");
    }
    delete(req, res) {
        throw new Error("Method not implemented.");
    }
}
exports.TestController = TestController;
