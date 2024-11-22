async function logout() {
  await Auth.ready;
  Auth.logout();
}

async function changePassword() {
  await Auth.ready;
  Auth.changePassword();
}
