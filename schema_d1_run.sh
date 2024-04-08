
# 1. Create DB
npx wrangler d1 create d1-trc404-prod

# 2.1 Local
npx wrangler d1 execute d1-trc404-prod --local --file=./ignore_schema.sql
npx wrangler d1 execute d1-trc404-prod --local --command="SELECT * FROM TrcUser"



# 2.2 Deploy
npx wrangler d1 execute d1-trc404-prod --file=./ignore_schema.sql
npx wrangler d1 execute d1-trc404-prod --command="SELECT * FROM TrcUser"


select refTgId,refTgUsername,count(refTgId) as refCount from trcuser group by refTgId order by refCount desc



select * from trcuser where refTgUsername='RotgarSett'
select count(*) from trcuser where refTgUsername='RotgarSett' and tgId!=tgUsername

=================================
refTgId	refTgUsername	refCount
104395521	RotgarSett	4569
=================================
