# Preview site (not production)

The live site stays on `main`:

https://cynthiasumyi-spec.github.io/revision-flashcards/

The new structure is only on the `preview` branch, under `v2/`. Open the Books stub at:

https://cynthiasumyi-spec.github.io/revision-flashcards-preview/v2/

That address is empty until the one-time connection below. This token cannot create a repository or an Actions secret (`POST /user/repos` returns 403), so that connection has to be clicked on the `cynthiasumyi-spec` account. After it is done, every push to `preview` updates the preview site. Pushes to `main` do not run this workflow.

## One-time connection

1. Create an empty public repository named `revision-flashcards-preview` on the account `cynthiasumyi-spec`.
   - Open https://github.com/new
   - Repository name: `revision-flashcards-preview`
   - Public
   - Leave “Add a README” off so the repo is empty
   - Create repository

2. Create a fine-grained personal access token that can write only to that new repo.
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Resource owner: `cynthiasumyi-spec`
   - Repository access: Only select repositories → `revision-flashcards-preview`
   - Repository permissions: Contents → Read and write
   - Generate the token and copy it. GitHub shows it once.

3. Save the token on this repo (not on the preview repo).
   - Open https://github.com/cynthiasumyi-spec/revision-flashcards/settings/secrets/actions
   - New repository secret
   - Name: `PREVIEW_DEPLOY_TOKEN`
   - Value: the token from step 2
   - Add secret

4. Re-run the failed “Deploy preview site” workflow (or push the `preview` branch again).
   - Open https://github.com/cynthiasumyi-spec/revision-flashcards/actions
   - The run is on branch `preview`
   - Re-run jobs
   - That push creates branch `gh-pages` on `revision-flashcards-preview`. It does not change `main` here and it does not change the live Pages site.

5. Turn on Pages for the new repo, from that branch.
   - Open https://github.com/cynthiasumyi-spec/revision-flashcards-preview/settings/pages
   - Build and deployment: Deploy from a branch
   - Branch: `gh-pages`, folder `/ (root)`
   - Save

Wait a minute, then open:

https://cynthiasumyi-spec.github.io/revision-flashcards-preview/v2/

The preview host’s own root page is the current classroom homepage plus a PREVIEW banner. The structure Wu should walk starts at `/v2/`.

Do not merge `preview` into `main`. A merge is what would put these files on the live site. The workflow file only runs for the `preview` branch, and production Pages is still “Deploy from branch `main` / root”.
