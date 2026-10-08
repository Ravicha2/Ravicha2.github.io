# auth.md

**This site needs no credentials. There is no sign-up, no API key, and no token to obtain. Every document here is a public read.** That is the whole answer, not a summary of a longer one — the rest of this file only explains how to confirm it and names the endpoints the spec would use, none of which are live.

An agent usually arrives here after a request was refused, or while following the OAuth discovery chain. Both routes are covered below. Read this file top to bottom once; every step that would normally exchange a secret says plainly that nothing is exchanged here.

## Step 1 — Discover

Discovery starts from one of two documents. Both are static files on this origin, and both point back at this prose.

### 1a. Fetch the Protected Resource Metadata

    GET https://ravicha2.github.io/.well-known/oauth-protected-resource

This is RFC 9728 protected-resource metadata. It names the `resource` (this origin), lists `authorization_servers` (also this origin, because a document here is the only thing that answers), and sets `resource_documentation` to `https://ravicha2.github.io/auth.md` — the file you are reading. That value points at prose, not at an API reference: there is no API here to reference, only public documents.

### 1b. Fetch the Authorization Server metadata

    GET https://ravicha2.github.io/.well-known/oauth-authorization-server

This is RFC 8414 authorization-server metadata. `issuer` is this origin. Its `agent_auth` block is reproduced below; `agent_auth.skill` and `identity_endpoint` both resolve to this document. The two dialects that read this block disagree on endpoint names, so both name sets are published in the one block — neither reader is left with an unparsable object.

```json
{
  "agent_auth": {
    "skill": "https://ravicha2.github.io/auth.md",

    "identity_endpoint": "https://ravicha2.github.io/auth.md",
    "claim_endpoint": "https://ravicha2.github.io/auth.md",
    "events_endpoint": "https://ravicha2.github.io/auth.md",

    "register_uri": "https://ravicha2.github.io/auth.md",
    "claim_uri": "https://ravicha2.github.io/auth.md",
    "revocation_uri": "https://ravicha2.github.io/auth.md",

    "identity_types_supported": ["anonymous"],
    "identity_assertion": {
      "assertion_types_supported": ["urn:ietf:params:oauth:token-type:id-jag"]
    }
  }
}
```

Read every URL in that block as a placeholder. The WorkOS dialect reads `identity_endpoint`, `claim_endpoint` and `events_endpoint`; the scanner recipe reads `register_uri`, `claim_uri` and `revocation_uri`. Both sets are here because both are read in the wild, but no service answers at any of these values — they name this document because this document is the only thing that responds. The `identity_assertion` object records the assertion type the specification would declare; it is not backed by an implementation. `identity_types_supported` is `["anonymous"]` because `anonymous` is the only identity type this origin can honour.

## Step 2 — Pick a method

Three method names circulate. Two describe machinery this origin does not have, and one applies.

### identity_assertion + id-jag

A client presents a signed identity assertion — an ID-JAG — and exchanges it for an access token. This origin issues no such credential and accepts none: there is no signing key, no registered issuer, and no exchange step. The `identity_assertion` key above holds `urn:ietf:params:oauth:token-type:id-jag` so that a reader expecting the spec's shape finds it, but the object describes a capability that is absent rather than one you can call.

### service_auth

Service authentication is machine-to-machine credentials between registered clients. Nothing here is registered, no client secret exists, and there is no account to authenticate as. Do not send client credentials; they will not be issued and cannot be validated.

### anonymous

This is the one method this origin honours, and the metadata advertises exactly it with `identity_types_supported: ["anonymous"]`. Reading is anonymous because there is nothing to protect: every document is already public. Choosing `anonymous` means proceed, send no `Authorization` header, and expect the content on the first request.

## Step 3 — Register

An origin that issued credentials would register your client here and return a client identifier. This origin issues nothing, so there is nothing to register and no identifier to return. The `register_uri` (scanner dialect) and `identity_endpoint` (WorkOS dialect) values in the block point back at this document because no registration service exists at this origin. Retrying with different parameters does not change the answer: registration is absent by design, not by misconfiguration.

## Step 4 — Claim ceremony

A claim ceremony is how a client that has registered proves it controls an identity. There is no registered client here, no identity to claim, and therefore nothing to prove. The `claim_uri` and `claim_endpoint` keys name the step the specification would define; they do not name a live route. If you are following a script that expects a challenge here, treat the absence of a challenge as the intended outcome.

## Step 5 — Exchange the assertion

This step would swap an identity assertion for an `access_token` at a token endpoint. No token endpoint is live on this origin, no `access_token` is issued, and there is no expiry, refresh, or scope to negotiate. If your client is written to demand a token, the correct behaviour is to record that none was required and continue anonymously rather than to retry.

## Step 6 — Use the access_token

None is issued, so none is sent. Requests to this origin are ordinary `GET`s with no `Authorization` header. Every document served here — the HTML pages, their markdown twins, `llms.txt`, `llms-full.txt`, `openapi.json`, and the `/.well-known` discovery files — is reachable the same anonymous way.

## Errors

`WWW-Authenticate` is the header a protected resource sends to tell a client what credential it wants. This origin does not challenge: nothing here is gated, so no request to it will return a `401` demanding a token, and no `WWW-Authenticate` header will arrive from it. If you did receive one, it came from a different origin — follow that header's `resource_metadata` parameter to that origin's discovery document, not to this one. Because there is no credential, there is also no credential error to repair: a `404` here means the path does not exist, never that you are unauthorized.

## Revocation

There is nothing to revoke. No credential was issued, so no `revocation_uri`, `events_endpoint`, or other revocation surface has anything to act on; those keys name the shape of the document, not a working endpoint. When you are finished, simply stop — there is no session to end, no token lifetime to expire, and no logout call to make.

**In one line: no credential is required, no endpoint is live, and this file is the complete answer.**
