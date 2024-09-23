import prisma from "./prismaclient";

const getRandomPrice = () => (Math.random() * (50 - 1) + 1).toFixed(2)

const getRandomDate = () =>{
    // generate a random date between 2023 and time of script run
    const start = new Date(2023,0,1) // january 1, 2023
    const end = new Date() // current date

    return new Date(start.getTime() + Math.random()*(end.getTime()-start.getTime()))
}

const seedPosts = async(numberOfPosts: number = 50) => {
    const posts = Array.from({length: numberOfPosts}).map(()=>({
        date: getRandomDate(), // generates random date and time
        price: parseFloat(getRandomPrice()) // generate random price
    }))

    try{
        await prisma.post.createMany({
            data: posts,
        })
        console.log(`Succesfully populated with ${numberOfPosts} posts.`)
    }catch(error){
        console.error('Error adding posts: ', error)
    }finally{
        await prisma.$disconnect()
    }
}

// call function to populate the database
seedPosts()