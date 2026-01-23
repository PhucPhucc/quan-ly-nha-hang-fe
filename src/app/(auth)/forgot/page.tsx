import axios from 'axios'

const page = async () => {
  await axios.post('/api/logout', {}, {
    withCredentials: true
  })
}

export default page