const usersMessages: { [userId: string]: string[] } = {};

export async function addUserMsg(userId: string, msg: string) {
  if (!usersMessages[userId]) {
    usersMessages[userId] = [];
  }
  usersMessages[userId].push(msg);
  console.log(JSON.stringify(usersMessages, null, 2));
  return usersMessages[userId].length;
}

export async function clearUserMsgs(userId: string) {
  if (usersMessages[userId]) {
    delete usersMessages[userId];
  }
}

export async function getUserMsgs(userId: string) {
  return usersMessages[userId].join("; ");
}
