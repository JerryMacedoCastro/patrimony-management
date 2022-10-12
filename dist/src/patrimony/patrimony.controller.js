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
const user_entity_1 = __importDefault(require("../user/user.entity"));
const S3Storage_1 = __importDefault(require("../utils/S3Storage"));
const patrimony_entity_1 = __importDefault(require("./patrimony.entity"));
class PatrimonyController {
    Get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = request.query;
                const { id } = params;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                let res;
                if (id === '0' || id === undefined) {
                    res = yield patrimonyRepository.find({ relations: ['user'] });
                }
                else {
                    res = yield patrimonyRepository.findOne({ where: { id: Number(id) }, relations: ['user'] });
                }
                return response.status(200).send(res !== null ? res : []);
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    Create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, number, location, userId } = request.body;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                const userRepository = ormconfig_1.default.getRepository(user_entity_1.default);
                const isExistingPatrimony = yield patrimonyRepository.findOneBy({
                    name
                });
                const isExistingUser = yield userRepository.findOneBy({
                    id: Number(userId)
                });
                if (isExistingPatrimony !== null)
                    throw new Error('The given patrimony already exists');
                if (isExistingUser === null)
                    throw new Error('The given user does not exist');
                const newPatrimony = patrimonyRepository.create({ name, number, location, user: isExistingUser });
                yield patrimonyRepository.save(newPatrimony);
                return response.status(200).send(newPatrimony);
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    CreateWithImage(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const { file } = request;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                const patrimony = yield patrimonyRepository.findOneBy({
                    id: Number(id)
                });
                if (patrimony === null) {
                    return response.status(400).send({ error: 'Patrimony not found' });
                }
                if (file === undefined) {
                    return response.status(400).send({ error: 'file must be sent!' });
                }
                const s3 = new S3Storage_1.default();
                yield s3.saveFile(file.filename, id);
                return response.json({ success: true });
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    Update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = request.params;
                const { id } = params;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                const { name, number, location, userId } = request.body;
                const userRepository = ormconfig_1.default.getRepository(user_entity_1.default);
                const isExistingUser = yield userRepository.findOneBy({
                    id: Number(userId)
                });
                if (isExistingUser === null || isExistingUser === undefined)
                    throw new Error('invalid user id');
                if (name === undefined)
                    throw new Error('Propert name is required!');
                if (number === undefined)
                    throw new Error('Propert number is required!');
                if (location === undefined)
                    throw new Error('Propert location is required!');
                const patrimonyToUpdate = yield patrimonyRepository.findOneByOrFail({
                    id: Number(id)
                });
                patrimonyToUpdate.name = name;
                patrimonyToUpdate.location = location;
                patrimonyToUpdate.number = number;
                patrimonyToUpdate.user = isExistingUser;
                yield patrimonyRepository.save(patrimonyToUpdate);
                return response.status(200).send(patrimonyToUpdate);
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    Delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = request.params;
                const { id } = params;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                const patrimony = yield patrimonyRepository.findOneByOrFail({
                    id: Number(id)
                });
                const s3 = new S3Storage_1.default();
                const content = yield s3.getImagesFromFolder(id);
                if (content !== undefined) {
                    content.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.Key !== undefined) {
                            yield s3.deleteFile(item.Key);
                        }
                    }));
                }
                yield patrimonyRepository.remove(patrimony);
                return response.status(200).send({ removed: patrimony });
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    GetPatrimonyImages(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = request.params;
                const { id } = params;
                const s3 = new S3Storage_1.default();
                const links = yield s3.getFile(id);
                if (links === undefined)
                    return response.status(200).send([]);
                return response.status(200).send(links);
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
}
exports.default = PatrimonyController;
