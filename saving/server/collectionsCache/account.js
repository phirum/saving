// Collection Cache
Saving.Collection.Account.cacheCount('performCount', Saving.Collection.Perform, 'accountId');

Saving.Collection.Account.cacheDoc('client', Saving.Collection.Client, [
    'khName', 'khNickName', 'enName', 'enNickName', 'gender', 'dob', 'idType', 'idNumber', 'expiryDate', 'address', 'telephone', 'email', 'photo'
]);

Saving.Collection.Account.cacheDoc('staff', Saving.Collection.Staff, [
    'name', 'gender', 'dob', 'position', 'address', 'telephone', 'email', 'photo'
]);
