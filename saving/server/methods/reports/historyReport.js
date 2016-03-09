Meteor.methods({
    getHistoryReport: function (arg) {
        var self = arg;
        var data = {
            title: {},
            header: [],
            content: [],
            footer: []
        };

        /********* Title *********/
        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company
        };

        /********* Header ********/
        var accountDoc = Saving.Collection.Account.findOne(self.account);
        var productDoc = Saving.Collection.Product.findOne(accountDoc.productId);
        var clientDoc = Saving.Collection.Client.findOne(accountDoc.clientId);
        var staffDoc = Saving.Collection.Staff.findOne(accountDoc.staffId);
        var branchDoc = Cpanel.Collection.Branch.findOne(accountDoc.cpanel_branchId);
        data.header = [
            {
                col1: 'Branch: ' + branchDoc.enName,
                col2: 'Cycle: ' + accountDoc.cycle
            },
            {
                col1: 'Currency: ' + accountDoc.cpanel_currencyId,
                col2: 'Client: ' + clientDoc.khName + ' (' + clientDoc.enName + '), Gender: ' + clientDoc.gender
            },
            {
                col1: 'Product: ' + productDoc.name,
                col2: 'Staff: ' + staffDoc.name
            },
            {
                col1: 'Term: ' + accountDoc.term + ' Months',
                col2: 'Account date: ' + accountDoc.accDate
            },
            {
                col1: 'Rate: ' + productDoc.rate + '% Per Year',
                col2: 'Maturity date: ' + accountDoc.maturityDate
            }
        ];

        /********** Content **********/
        var content = [];
        var index = 1;

        //Edit by Phirum
        var selector={};
        var date = s.words(self.date, ' To ');
        selector.accountId=self.account;
        selector.performDate={$gte: date[0], $lte: date[1]};

        var accountPerform = Saving.Collection.Perform.find(selector, {sort: {_id: 1}});

        accountPerform.forEach(function (obj) {
            content.push(
                {
                    index: index,
                    date: obj.performDate,
                    dayNumber: obj.dayNumber,
                    principalRe: numeral(obj.principalRe).format('0,0.00'),
                    interestRe: numeral(obj.interestRe).format('0,0.00'),
                    amount: numeral(obj.amount).format('0,0.00'),
                    principalBal: numeral(obj.principalBal).format('0,0.00'),
                    interestBal: numeral(obj.interestBal).format('0,0.00'),
                    voucherId: obj.voucherId,
                    memo: obj.memo
                }
            );
            index += 1;
        });

        if (content.length > 0) {
            data.content = content;
            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }

    }
})