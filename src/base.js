exports.install = function (Vue, options) {
  /**
   * 定义验证权限
   */
  Vue.prototype.authorities = function (auth) {
    var auths = this.$store.state.user.authorities
    for (var i = 0; i < auths.length; i++) {
      var authon = auths[i]
      if (auth === authon.authority) {
        return true
      }
    }
    return false
  }
}
