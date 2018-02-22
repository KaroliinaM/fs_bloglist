const dummy=(blogs)=>{
  return 1
}
const totalLikes=(blogs)=>{
  const taul=blogs.map(blog=>blog.likes)
  const reducer=(sum, item) => {
    return sum + item
  }
  return taul.reduce(reducer, 0)
}
const favoriteBlog=(blogs)=>{
  if(blogs.length===0)
  {
    return null
  }
  let suurin=blogs[0]
  for(i=0; i<blogs.length; i++) {
    if(blogs[i].likes>suurin.likes){
      suurin=blogs[i]
    }
  }
  return suurin;
}
const mostBlogs=(blogs)=>{
  if(blogs.length===0)
  {
    return null
  }
  const taul=blogs.map(blog=>blog.author)
  taul.sort()
  let current=taul[0]
  let result=taul[0]
  let i=0
  let suurin=0
  taul.forEach(function(element){
    if(element!==current){
      current=element
      i=1
    }else{
      i++
      if(i>suurin){
        suurin=i
        result=current
      }
    }
  })
  return result
}
const mostLikes=(blogs)=>{
  if(blogs.length===0){
    return null
  }
  let authors=[]
  blogs.forEach(function(element){
    if(authors.filter(blog=>blog.author===element.author).length>0){
      authors.filter(blog=>blog.author===element.author)[0].likes+=element.likes
    } else {
      authors.push({
        author: element.author,
        likes: element.likes
      })
    }
  })
  let res=authors[0]
  authors.forEach(function(element){
    if(res.likes<element.likes){
      res=element
    }
  })
  return res
}

module.exports={
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
