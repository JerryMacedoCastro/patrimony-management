"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ormconfig_1 = __importDefault(require("../../ormconfig"));
const user_entity_1 = __importDefault(require("./user.entity"));
class UserController {
    createUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password } = request.body;
            try {
                const userRepository = ormconfig_1.default.getRepository(user_entity_1.default);
                const isExistingUser = yield userRepository.findOneBy({ email });
                if (isExistingUser != null) {
                    throw new Error('The email already exists!!');
                }
                const user = userRepository.create({
                    name,
                    email,
                    password
                });
                user.hashPassword();
                const res = yield userRepository.save(user);
                return response.status(201).send(res);
            }
            catch ({ message }) {
                return response.status(400).send(message);
            }
        });
    }
    getUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = request.params;
                const userRepository = ormconfig_1.default.getRepository(user_entity_1.default);
                if (userId !== undefined && userId !== '0') {
                    const user = yield userRepository.findOneBy({ id: Number(userId) });
                    if (user != null)
                        return response.status(200).send(user);
                    throw new Error('User not found');
                }
                const allUsers = yield userRepository.find();
                return response.status(200).send(allUsers);
            }
            catch ({ message }) {
                return response.status(400).send(message);
            }
        });
    }
}
exports.default = UserController;
