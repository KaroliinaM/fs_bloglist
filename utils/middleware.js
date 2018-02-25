const getTokenFrom=(request)=>{
  const authorization=request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

  const tokenExtractor=(request, response, next)=>
  {
    const token=getTokenFrom(request)
    request.token=token
  console.log('hei')
  next()
}
  const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


module.exports={tokenExtractor}
