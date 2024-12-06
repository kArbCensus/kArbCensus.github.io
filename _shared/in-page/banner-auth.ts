async function logout() {
  await Auth.ready;
  Auth.logout();
}

async function resetPassword() {
  await Auth.ready;
  Auth.resetPassword();
}
