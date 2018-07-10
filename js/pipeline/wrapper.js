const { Right, Left } = require('monet')

module.exports = {
  tryCatchify: effect => {
    try {
      return Right(effect())
    } catch (e) {
      return Left(e)
    }
  }
}
