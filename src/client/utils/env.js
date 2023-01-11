export function getEnv () {
  const env_dev = 'http://localhost:5432'
  const env_prod = 'http://124.223.162.201:5432'
  return process.env.NODE_ENV === 'development' ? env_dev : env_prod
}