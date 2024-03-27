
# 1. Create DB
npx wrangler d1 create d1-trc404-prod

# 2.1 Local
npx wrangler d1 execute d1-trc404-prod --local --file=./schema.sql
npx wrangler d1 execute d1-trc404-prod --local --command="SELECT * FROM TrcUser"



# 2.2 Deploy
npx wrangler d1 execute d1-trc404-prod --file=./schema.sql
npx wrangler d1 execute d1-trc404-prod --command="SELECT * FROM Customers"
