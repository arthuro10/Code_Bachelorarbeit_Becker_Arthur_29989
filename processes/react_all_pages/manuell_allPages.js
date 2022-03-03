const Task_a = require('../process_a/pages/Comp_Task_a');
const Task_b = require('../process_a/pages/Comp_Task_b');
const B_Task_a = require('../process_b/pages/CompB_Task_a');
const B_Task_b = require('../process_b/pages/CompB_Task_b');
const C_Task_a = require('../process_c/pages/CompC_Task_a');
const C_Task_b = require('../process_c/pages/CompC_Task_b');
const C_Task_c = require('../process_c/pages/CompC_Task_c');
const D_Task_a = require('../process_d/pages/CompD_Task_a');
const D_Task_b = require('../process_d/pages/CompD_Task_b');
const D_Task_c = require('../process_d/pages/CompD_Task_c');
const D_Task_d = require('../process_d/pages/CompD_Task_d');
const D_Task_e = require('../process_d/pages/CompD_Task_e');
const E_Task_a = require('../process_e/pages/CompE_Task_a');
const E_Task_b = require('../process_e/pages/CompE_Task_b');
const E_Task_c = require('../process_e/pages/CompE_Task_c');
const E_Task_d = require('../process_e/pages/CompE_Task_d');
const E_Task_e = require('../process_e/pages/CompE_Task_e');
const E_Task_f = require('../process_e/pages/CompE_Task_f');
const E_Task_g = require('../process_e/pages/CompE_Task_g');
const A_NewWorker = require('../newWorker/pages/a_eintragen')
const B_NewWorker = require('../newWorker/pages/b_checken')
const C_NewWorker = require('../newWorker/pages/c_liste_eintragen')
const D_NewWorker = require('../newWorker/pages/d_beantragen')
const E_NewWorker = require('../newWorker/pages/e_email_verschicken')
// Bestellung mag
const A_Bestellung_mag = require('../bestellung_mag/pages/a_teile_bestellen');
const B_Bestellung_mag = require('../bestellung_mag/pages/b_bestätigen_chef');
const C_Bestellung_mag = require('../bestellung_mag/pages/c_bestätigen_logistik');
const D_Bestellung_mag = require('../bestellung_mag/pages/d_lieferant_bestätigen');
const E_Bestellung_mag = require('../bestellung_mag/pages/e_logistik_eingeräumt');
// Test
/*const A_Test_Task = require('../process_test/pages/CompTest_Task_a');
const B_Test_Task = require('../process_test/pages/CompTest_Task_b');
const C_Test_Task = require('../process_test/pages/CompTest_Task_c');
const D_Test_Task = require('../process_test/pages/CompTest_Task_d');*/

module.exports = [
    Task_a,
    Task_b,
    B_Task_a,
    B_Task_b,
    C_Task_a,
    C_Task_b,
    C_Task_c,
    D_Task_a,
    D_Task_b,
    D_Task_c,
    D_Task_d,
    D_Task_e,
    E_Task_a,
    E_Task_b,
    E_Task_c,
    E_Task_d,
    E_Task_e,
    E_Task_f,
    E_Task_g,
    A_Bestellung_mag,
    B_Bestellung_mag,
    C_Bestellung_mag,
    D_Bestellung_mag,
    E_Bestellung_mag,
    A_NewWorker,
    B_NewWorker,
    C_NewWorker,
    D_NewWorker,
    E_NewWorker
]