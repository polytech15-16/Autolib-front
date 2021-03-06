function authInterceptor(API, auth) {
  return {
    // automatically attach Authorization header
    request: function (config) {
      console.log("hgrijegiroghrioeriogg");
      var token = auth.getToken();
      console.log(token);
      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = 'token : ' + token;
      }

      return config;
    },

    // If a token was sent back, save it
    response: function (res) {
      if (res.data.status && res.data.token != null) {
        auth.saveToken(res.data.token);
      }
      return res;
    },
  }
}

function authService($window, $cookies) {
  var self = this;

  self.parseJwt = function (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  self.saveToken = function (token) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    $cookies.put('token', token, {'expires': expireDate});
  }

  self.getToken = function () {
    $cookies.get('token');
  }

  self.isAuthed = function () {
    var token = $cookies.get('token');
    if (token) {
      var params = self.parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  };

  self.logout = function () {
    $cookies.remove('token');
  };
}

function userService($http, API) {
  var self = this;

  self.register = function (username, password) {
    return $http.post(API + 'authenticate', {
      login: username,
      password: password
    })
  };

  self.login = function (username, password) {
    return $http.post(API + 'authenticate', {
      login: username,
      password: password
    })
  };
}
