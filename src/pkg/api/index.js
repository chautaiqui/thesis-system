const _promise = obj => new Promise(resolve => setTimeout(() => resolve(obj), 1000));

const signin = {
  withPw: () => _promise({
    success: true,
    result: {
      phone: '+84905834124',
      token: '123',
      roles: ['plans','users','transaction']
    }
  }),
  withToken: () => _promise({
    success: true,
    result: {
      phone: '+84905834124',
      token: '123',
      roles: ['plans','users','transaction']
    }
  })
}

const fetchData = {
  plans: () => _promise({
    success: true,
    result: [
      {
        id: 1,
        name: 'a',
        diamond: 1,
        price: 1,
        enabled: true
      },
      {
        id: 2,
        name: 'b',
        diamond: 2,
        price: 2,
        enabled: true
      }
    ]
  }),
  users: () => {},
  transaction: () => {}
}

const postData = {
  plans: () => _promise({
    success: true,
    result: {
      id: 1,
      name: 'a',
      diamond: 1,
      price: 1,
      enabled: true
    }
  }),
  users: () => {},
  transaction: () => {}
}

export { signin, fetchData, postData };