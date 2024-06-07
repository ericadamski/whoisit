"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const whois = __importStar(require("../index"));
describe("lookup", () => {
    test("should work with google.com", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.com")).resolves.toEqual(expect.any(String));
    }));
    test("should work with 50.116.8.109", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("50.116.8.109")).resolves.toEqual(expect.any(String));
    }));
    test("should work with 2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d")).resolves.toEqual(expect.any(String));
    }));
    test("should honor specified WHOIS server", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("gandi.net", { server: { host: "whois.gandi.net" } })).resolves.toEqual(expect.any(String));
    }));
    test("should honor specified WHOIS server with port override", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("tucows.com", {
            server: { host: "whois.tucows.com", port: 43 },
        })).resolves.toEqual(expect.any(String));
    }));
    test("should follow specified number of redirects for domain", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.com", {
            follow: 1,
        })).resolves.toEqual(expect.any(String));
    }));
    test("should follow specified number of redirects for IP address", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("176.58.115.202", {
            follow: 1,
        })).resolves.toEqual(expect.any(String));
    }));
    test("should work with verbose option", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("176.58.115.202", {
            verbose: true,
        })).resolves.toEqual(expect.arrayContaining([
            expect.objectContaining({
                server: expect.any(String),
                data: expect.any(String),
            }),
        ]));
    }));
    test("should work with nic.sh", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.sh")).resolves.toEqual(expect.any(String));
    }));
    test("should work with nic.io", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.io")).resolves.toEqual(expect.any(String));
    }));
    test("should work with nic.ac", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.ac")).resolves.toEqual(expect.any(String));
    }));
    test("should work with nic.tm", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.tm")).resolves.toEqual(expect.any(String));
    }));
    test("should work with nic.global", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.global")).resolves.toEqual(expect.any(String));
    }));
    test("should work with srs.net.nz", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("srs.net.nz")).resolves.toEqual(expect.any(String));
    }));
    test("should work with redundant follow", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.com", { follow: 5 })).resolves.toEqual(expect.any(String));
    }));
    test("should work with küche.de", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("küche.de")).resolves.toEqual(expect.any(String));
    }));
    test("should work with google.co.jp in english", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.co.jp")).resolves.toEqual(expect.any(String));
    }));
    test("should work with registry.pro", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("registry.pro", { follow: 0 })).resolves.toEqual(expect.any(String));
    }));
    test("should fail with google.com due to timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.com", { timeout: 1 })).rejects.toMatchInlineSnapshot(`[Error: lookup: timeout]`);
    }));
    test("should succeed with google.com with timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("google.com", { timeout: 10000 })).resolves.toEqual(expect.any(String));
    }));
    test("should work with åre.no", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("åre.no")).resolves.toEqual(expect.any(String));
    }));
    test("should work with nic.digital", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("nic.digital")).resolves.toEqual(expect.any(String));
    }));
    test("should work with whois.nic.ai", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("whois.nic.ai")).resolves.toEqual(expect.any(String));
    }));
    test("should work with currentzoology.org", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("currentzoology.org")).resolves.toEqual(expect.any(String));
    }));
    test("should work with 148.241.109.161", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("148.241.109.161", { encoding: "binary" })).resolves.toEqual(expect.any(String));
    }));
    test("should work with dot.ai", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("dot.ai")).resolves.toEqual(expect.any(String));
    }));
    test("should avoid socket BAD_PORT Error and fail with a catchable ECONNRESET with whois.yesnic.com (eigene.io)", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("eigene.io", { follow: 2, timeout: 10000 })).rejects.toMatchInlineSnapshot(`[Error: read ECONNRESET]`);
    }));
    test("should work with gen.xyz", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(whois.lookup("gen.xyz")).resolves.toEqual(expect.any(String));
    }));
});
