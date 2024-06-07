import * as whois from "../index";

describe("lookup", () => {
  test("should work with google.com", async () => {
    await expect(whois.lookup("google.com")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with 50.116.8.109", async () => {
    await expect(whois.lookup("50.116.8.109")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with 2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d", async () => {
    await expect(
      whois.lookup("2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d")
    ).resolves.toEqual(expect.any(String));
  });

  test("should honor specified WHOIS server", async () => {
    await expect(
      whois.lookup("gandi.net", { server: { host: "whois.gandi.net" } })
    ).resolves.toEqual(expect.any(String));
  });

  test("should honor specified WHOIS server with port override", async () => {
    await expect(
      whois.lookup("tucows.com", {
        server: { host: "whois.tucows.com", port: 43 },
      })
    ).resolves.toEqual(expect.any(String));
  });

  test("should follow specified number of redirects for domain", async () => {
    await expect(
      whois.lookup("google.com", {
        follow: 1,
      })
    ).resolves.toEqual(expect.any(String));
  });

  test("should follow specified number of redirects for IP address", async () => {
    await expect(
      whois.lookup("176.58.115.202", {
        follow: 1,
      })
    ).resolves.toEqual(expect.any(String));
  });

  test("should work with verbose option", async () => {
    await expect(
      whois.lookup("176.58.115.202", {
        verbose: true,
      })
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          server: expect.any(String),
          data: expect.any(String),
        }),
      ])
    );
  });

  test("should work with nic.sh", async () => {
    await expect(whois.lookup("nic.sh")).resolves.toEqual(expect.any(String));
  });

  test("should work with nic.io", async () => {
    await expect(whois.lookup("nic.io")).resolves.toEqual(expect.any(String));
  });

  test("should work with nic.ac", async () => {
    await expect(whois.lookup("nic.ac")).resolves.toEqual(expect.any(String));
  });

  test("should work with nic.tm", async () => {
    await expect(whois.lookup("nic.tm")).resolves.toEqual(expect.any(String));
  });

  test("should work with nic.global", async () => {
    await expect(whois.lookup("nic.global")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with srs.net.nz", async () => {
    await expect(whois.lookup("srs.net.nz")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with redundant follow", async () => {
    await expect(whois.lookup("google.com", { follow: 5 })).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with küche.de", async () => {
    await expect(whois.lookup("küche.de")).resolves.toEqual(expect.any(String));
  });

  test("should work with google.co.jp in english", async () => {
    await expect(whois.lookup("google.co.jp")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with registry.pro", async () => {
    await expect(whois.lookup("registry.pro", { follow: 0 })).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should fail with google.com due to timeout", async () => {
    await expect(
  whois.lookup("google.com", { timeout: 1 })
).rejects.toMatchInlineSnapshot(`[Error: lookup: timeout]`);
  });

  test("should succeed with google.com with timeout", async () => {
    await expect(
      whois.lookup("google.com", { timeout: 10000 })
    ).resolves.toEqual(expect.any(String));
  });

  test("should work with åre.no", async () => {
    await expect(whois.lookup("åre.no")).resolves.toEqual(expect.any(String));
  });

  test("should work with nic.digital", async () => {
    await expect(whois.lookup("nic.digital")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with whois.nic.ai", async () => {
    await expect(whois.lookup("whois.nic.ai")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with currentzoology.org", async () => {
    await expect(whois.lookup("currentzoology.org")).resolves.toEqual(
      expect.any(String)
    );
  });

  test("should work with 148.241.109.161", async () => {
    await expect(
      whois.lookup("148.241.109.161", { encoding: "binary" })
    ).resolves.toEqual(expect.any(String));
  });

  test("should work with dot.ai", async () => {
    await expect(whois.lookup("dot.ai")).resolves.toEqual(expect.any(String));
  });

  test("should avoid socket BAD_PORT Error and fail with a catchable ECONNRESET with whois.yesnic.com (eigene.io)", async () => {
    await expect(
  whois.lookup("eigene.io", { follow: 2, timeout: 10000 })
).rejects.toMatchInlineSnapshot(`[Error: read ECONNRESET]`);
  });

  test("should work with gen.xyz", async () => {
    await expect(whois.lookup("gen.xyz")).resolves.toEqual(expect.any(String));
  });
});
