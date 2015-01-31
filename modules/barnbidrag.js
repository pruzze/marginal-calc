/**
 * @file    Innehåller modulerna {@link barnBidrag} och {@link studieBidrag}
 * @version 1.0
 * @author Hanif Bali
 */
(function () {

    /**
     * Barnbidragsmodul
     *
     * @alias barnBidrag
     * @constructor
     * @implements {Module}
     * @param {houseHold} houseHold Hushållet som kalkyleringarna ska göras på.
     */
    function barnBidrag(houseHold) {
        const Barnbidrag = 1050;
        /**
         * Räknar ut hela hushållets barnbidrag och flerbarnstillägg
         * @returns {Number}
         */
        this.totalCalc = function () {
            return this.getBarnBidrag() + this.getFlerbarnstillagg();
        };
        /**
         * Barnbidrag för samtliga barn
         *
         * Denna funktion sparar även barnbidraget på vederbörande person i hushållet.
         * @returns {Number} barnbidrag
         */
        this.getBarnBidrag = function () {

            var totalBarnbidrag = 0;
            var kids = houseHold.getPersonsBelowAge(16);

            for (var a = 0; a < kids.length; a++) {
                totalBarnbidrag += kids[a].setData("barnbidrag", Barnbidrag);
            }
            return totalBarnbidrag;
        };
        /**
         * Flerbarnstillägg
         *
         * @returns {Number} flerbarnstillägg
         */
        this.getFlerbarnstillagg = function () {
            var tillagg = 0;
            var persons = houseHold.getPersonsBelowAge(21);
            switch (persons.length) {
                case 0:
                case 1:
                    break;
                case 2:
                    tillagg = 150;
                    break;
                case 3:
                    tillagg = 604;
                    break;
                case 4:
                    tillagg = 1614;
                default:
                    // 1050 kr för varje barn över 4 så adderar du
                    var flerbarnsTillag = 2864;
                    for (var i = 0; i < (persons.length - 5); i++) {
                        flerbarnsTillag += 1250;
                    }
                    tillagg = flerbarnsTillag;
                    break;
            }
            return tillagg;
        }
    };
    /*
     Studiestödslag (1999:1395) 2 kap.
     */

    /**
     * Studiebidragsmodul
     *
     * @alias studieBidrag
     * @constructor
     * @implements {Module}
     * @param {houseHold} houseHold
     */
    function studieBidrag(houseHold) {
        const Studiebidrag = 1050;
        /**
         * Räknar ut hela Studiebidraget
         * @returns {Number}
         */
        this.totalCalc = function () {
            return this.getStudieBidrag();
        };
        /**
         * Räknar ut Studiebidraget
         *
         * Lägger även till det extra tillägg som ges till studenter med föräldrar med svag ekonomi.
         *
         * @returns {Number}
         */
        this.getStudieBidrag = function () {
            var income = houseHold.getHouseHoldTaxableIncome();
            var extra = 0;
            if (income < 85000) {
                extra = 855;
            } else if (income > 104999) {
                extra = 570;
            } else if (income > 124999) {
                extra = 285;
            }
            var persons = houseHold.getPersons();
            var studieBidrag = 0;
            for (var a = 0; a < persons.length; a++) {
                if (persons[a].age > 15 && persons[a].age < 21) {
                    studieBidrag += persons[a].studiebidrag = Studiebidrag + extra;
                }
            }
            return studieBidrag;
        }

    };

    marginalCalc.addModule("barnBidrag", barnBidrag, 101);
    marginalCalc.addModule("studieBidrag", studieBidrag, 102);


    marginalCalc.scriptLoader.loadComplete("barnbidrag");
})();