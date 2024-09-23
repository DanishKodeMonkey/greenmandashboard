
import prisma from '../db/prismaclient'

/* Prisma client implicitly uses its generated typescript types */
const postQueries = {
    getAllPosts: async()=>{
        try{
            const posts = await prisma.post.findMany()
            return posts
        }catch(err){
            console.error('Error fetching all posts: ', err)
            throw new Error('Error fetching all posts')
        }
    }
}

export default postQueries