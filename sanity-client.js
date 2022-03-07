import dotenv from 'dotenv'
dotenv.config()
import sanityClient from '@sanity/client'

export const sanity = sanityClient({
	projectId: process.env.PROJECT_ID,
	dataset: 'production',
	apiVersion: 'v1',
	token: process.env.API_TOKEN,
	useCdn: false,
})
