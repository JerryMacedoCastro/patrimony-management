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
const patrimony_entity_1 = __importDefault(require("./patrimony.entity"));
class PatrimonyController {
    Get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = request.params;
                const { id } = params;
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                let res;
                if (params !== undefined) {
                    res = yield patrimonyRepository.find();
                }
                else {
                    res = yield patrimonyRepository.findOneBy({ id: Number(id) });
                }
                return response.status(200).send(res);
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
    Create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patrimonyRepository = ormconfig_1.default.getRepository(patrimony_entity_1.default);
                const { name, number, location } = request.body;
                const isExistingPatrimony = yield patrimonyRepository.findOneBy({
                    name
                });
                if (isExistingPatrimony != null)
                    throw new Error('The given patrimony already exists');
                const newPatrimony = patrimonyRepository.create({ name, number, location });
                yield patrimonyRepository.save(newPatrimony);
                return response.status(200).send(newPatrimony);
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
                const { name, number, location } = request.body;
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
                yield patrimonyRepository.remove(patrimony);
                return response.status(200).send({ removed: patrimony });
            }
            catch ({ message }) {
                return response.status(400).send({ error: message });
            }
        });
    }
}
exports.default = PatrimonyController;
