import { getGPSdata } from "../src/AVL Data Parser/GPSelement"

test("Test online value", () => {
    let parsed = getGPSdata(0x209cca80)
    expect(parsed).toBeCloseTo(54.7146368)
})