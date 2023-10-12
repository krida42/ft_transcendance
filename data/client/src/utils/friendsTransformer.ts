export class FriendsTransformer {
  static toArray(friends: Map<Id, Friend>): Friend[] {
    return Array.from(friends.values());
  }

  static divideFriendsByN(friends: Friend[], n: number): Friend[][] {
    const dividedFriendsArray = [];
    for (let i = 0; i < friends.length; i += n) {
      dividedFriendsArray.push(friends.slice(i, i + n));
    }
    return dividedFriendsArray;
  }
}
