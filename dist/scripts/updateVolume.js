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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumVolumeM3 = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var TreeStatus;
(function (TreeStatus) {
    TreeStatus["NONE"] = "NONE";
    TreeStatus["PARTIAL"] = "PARTIAL";
    TreeStatus["FULL"] = "FULL";
})(TreeStatus || (TreeStatus = {}));
function updateVolume3() {
    return __awaiter(this, void 0, void 0, function () {
        var trees, _loop_1, _i, trees_1, tree, species, _loop_2, _a, species_1, specie;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prisma.tree.findMany({
                        where: {
                            sections: {
                                some: {},
                            },
                        },
                        include: {
                            sections: true,
                        },
                    })];
                case 1:
                    trees = _b.sent();
                    _loop_1 = function (tree) {
                        var totalVolumeM3, status_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    totalVolumeM3 = 0;
                                    status_1 = TreeStatus.NONE;
                                    tree.sections.forEach(function (section) {
                                        if (section.tree_id === tree.id) {
                                            var d1 = section.d1, d2 = section.d2, d3 = section.d3, d4 = section.d4, meters = section.meters;
                                            var volumeM3 = sumVolumeM3({ d1: d1, d2: d2, d3: d3, d4: d4, meters: meters });
                                            totalVolumeM3 += volumeM3; // Acumula o volume total
                                        }
                                    });
                                    if (totalVolumeM3 < tree.volumeM3 && totalVolumeM3 > 0) {
                                        status_1 = TreeStatus.PARTIAL;
                                    }
                                    else if (totalVolumeM3 >= tree.volumeM3) {
                                        status_1 = TreeStatus.FULL;
                                    }
                                    return [4 /*yield*/, prisma.tree.update({
                                            where: { id: tree.id },
                                            data: { sectionsVolumeM3: totalVolumeM3, status: status_1 },
                                        })];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, trees_1 = trees;
                    _b.label = 2;
                case 2:
                    if (!(_i < trees_1.length)) return [3 /*break*/, 5];
                    tree = trees_1[_i];
                    return [5 /*yield**/, _loop_1(tree)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, prisma.species.findMany({
                        where: {
                            trees: {
                                some: {},
                            },
                        },
                        include: {
                            trees: true,
                        },
                    })];
                case 6:
                    species = _b.sent();
                    _loop_2 = function (specie) {
                        var totalVolumeM3;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    totalVolumeM3 = 0;
                                    specie.trees.forEach(function (tree) {
                                        totalVolumeM3 += tree.sectionsVolumeM3; // Acumula o volume total
                                    });
                                    specie.sectionsVolumeM3 = totalVolumeM3;
                                    return [4 /*yield*/, prisma.species.update({
                                            where: { id: specie.id },
                                            data: { sectionsVolumeM3: totalVolumeM3 },
                                        })];
                                case 1:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, species_1 = species;
                    _b.label = 7;
                case 7:
                    if (!(_a < species_1.length)) return [3 /*break*/, 10];
                    specie = species_1[_a];
                    return [5 /*yield**/, _loop_2(specie)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function sumVolumeM3(_a) {
    var d1 = _a.d1, d2 = _a.d2, d3 = _a.d3, d4 = _a.d4, meters = _a.meters;
    var pi = Math.PI;
    var averageD1D2 = (((d1 / 100) + (d2 / 100)) / 2);
    var averageD3D4 = (((d3 / 100) + (d4 / 100)) / 2);
    var volumeM3 = ((((Math.pow(averageD1D2, 2) * (pi / 4)) + (Math.pow(averageD3D4, 2) * (pi / 4))) / 2) * (meters / 100));
    return Math.ceil((volumeM3 * 1000));
}
exports.sumVolumeM3 = sumVolumeM3;
updateVolume3()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
