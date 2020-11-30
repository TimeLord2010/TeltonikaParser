"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIGPSelement = void 0;
function isIGPSelement(obj) {
    return obj && typeof obj.Angle === 'number' && typeof obj.Speed === 'number' && ['string', 'number'].includes(typeof obj.Latitude);
}
exports.isIGPSelement = isIGPSelement;
