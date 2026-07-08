/**
 * Baxter Solutions — ROI Calculators
 * Two calculators, both vanilla JS, zero dependencies, instant client-side.
 *
 * 1. Restaurant Voice AI Calculator
 *    Inputs: covers/week, avg ticket ($), missed calls/week
 *    Outputs: annual missed revenue, voice AI cost, 12-month net estimate
 *    Key assumption: % of missed calls that would have booked + avg covers per reservation
 *
 * 2. VA Replacement / 12-Month TCO Calculator
 *    Inputs: VA monthly spend ($), VA hours/month, your oversight hours/week
 *    Outputs: 12-month VA TCO vs 12-month automation TCO, payback period
 *
 * HONEST-MATH DISCLAIMER: All outputs are ESTIMATES. Every assumption is
 * displayed on screen and editable. This is an illustrative model, not a
 * financial projection. Actual outcomes depend on your specific situation.
 *
 * ------------------------------------------------------------------ */

'use strict';

/* ── SHARED UTILITIES ── */

function fmt(n) {
  // Format as $ with commas, no cents
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtMo(n) {
  return fmt(n) + '/mo';
}

function el(id) {
  return document.getElementById(id);
}

function val(id, defaultVal) {
  var e = el(id);
  if (!e) return defaultVal;
  var v = parseFloat(e.value);
  return isNaN(v) ? defaultVal : v;
}

/* ── 1. RESTAURANT VOICE AI CALCULATOR ── */

function initRestaurantCalc() {
  var container = el('restaurant-roi-calc');
  if (!container) return;

  container.innerHTML = [
    '<div class="roi-calc" aria-label="Restaurant Voice AI ROI estimator">',

    '  <div class="roi-calc__header">',
    '    <h3 class="roi-calc__title">Estimate your missed-call revenue</h3>',
    '    <p class="roi-calc__subtitle">',
    '      Every number below is editable. Change any assumption to match your operation.',
    '    </p>',
    '    <div class="roi-calc__honest-note">',
    '      <strong>ESTIMATE.</strong> This model uses your inputs and the assumptions shown.',
    '      It is not a projection. Actual outcomes depend on your call mix, market, and operations.',
    '    </div>',
    '  </div>',

    '  <div class="roi-calc__inputs">',

    '    <div class="roi-calc__section-label">Your restaurant</div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-covers" class="roi-calc__label">',
    '        Avg covers per week',
    '        <span class="roi-calc__hint">Seated guests, not delivery</span>',
    '      </label>',
    '      <input id="r-covers" class="roi-calc__input" type="number" min="1" value="350">',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-ticket" class="roi-calc__label">',
    '        Average ticket per cover ($)',
    '        <span class="roi-calc__hint">Revenue per seat, food + drinks</span>',
    '      </label>',
    '      <input id="r-ticket" class="roi-calc__input" type="number" min="1" value="45">',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-missed" class="roi-calc__label">',
    '        Estimated missed calls per week',
    '        <span class="roi-calc__hint">Calls that go to voicemail or ring out unanswered</span>',
    '      </label>',
    '      <input id="r-missed" class="roi-calc__input" type="number" min="0" value="30">',
    '    </div>',

    '    <div class="roi-calc__section-label">Assumptions — edit these</div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-book-rate" class="roi-calc__label">',
    '        % of missed calls that were booking attempts',
    '        <span class="roi-calc__hint">Conservative: 40%. Adjust based on your call mix. Includes reservations + party inquiries.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <input id="r-book-rate" class="roi-calc__input" type="number" min="1" max="100" value="40">',
    '        <span class="roi-calc__unit">%</span>',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-conv-rate" class="roi-calc__label">',
    '        % of answered booking calls that convert to a reservation',
    '        <span class="roi-calc__hint">Conservative: 60%. Phone inquiries that get answered usually book.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <input id="r-conv-rate" class="roi-calc__input" type="number" min="1" max="100" value="60">',
    '        <span class="roi-calc__unit">%</span>',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-covers-per-res" class="roi-calc__label">',
    '        Average covers per reservation',
    '        <span class="roi-calc__hint">Typical party size on phone reservations. Common: 2–3.</span>',
    '      </label>',
    '      <input id="r-covers-per-res" class="roi-calc__input" type="number" min="1" value="2.5">',
    '    </div>',

    '    <div class="roi-calc__section-label">Voice AI cost (Baxter Solutions)</div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-setup" class="roi-calc__label">',
    '        Setup cost',
    '        <span class="roi-calc__hint">One-time — amortize over 12 months in the comparison</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="r-setup" class="roi-calc__input" type="number" min="0" value="2500">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-managed" class="roi-calc__label">',
    '        Monthly managed retainer (optional)',
    '        <span class="roi-calc__hint">$400/mo if you want us monitoring + tuning. $0 if you manage it yourself.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="r-managed" class="roi-calc__input" type="number" min="0" value="400">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="r-infra" class="roi-calc__label">',
    '        Monthly infrastructure (Twilio + Vapi + OpenAI)',
    '        <span class="roi-calc__hint">Estimate: ~$30–50/mo. You pay this directly to the vendors.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="r-infra" class="roi-calc__input" type="number" min="0" value="40">',
    '      </div>',
    '    </div>',

    '  </div>',

    '  <div class="roi-calc__output" id="r-output" aria-live="polite" aria-label="Calculation results">',
    '    <!-- populated by calcRestaurant() -->',
    '  </div>',

    '  <p class="roi-calc__disclaimer">',
    '    ESTIMATE — not a financial projection. Assumptions: booking-attempt rate, conversion rate, and',
    '    covers-per-reservation are industry-informed defaults you should adjust to match your actual',
    '    experience. Loman AI\'s published 22% revenue lift (pizza operators, 2023) is a market reference,',
    '    not a prediction for your restaurant.',
    '  </p>',

    '</div>'
  ].join('\n');

  // Wire inputs to calculator
  var inputs = container.querySelectorAll('.roi-calc__input');
  inputs.forEach(function(input) {
    input.addEventListener('input', calcRestaurant);
  });

  calcRestaurant();
}

function calcRestaurant() {
  var output = el('r-output');
  if (!output) return;

  var coversPerWeek     = val('r-covers', 350);
  var ticketPerCover    = val('r-ticket', 45);
  var missedPerWeek     = val('r-missed', 30);
  var bookingRate       = val('r-book-rate', 40) / 100;
  var convRate          = val('r-conv-rate', 60) / 100;
  var coversPerRes      = val('r-covers-per-res', 2.5);
  var setupCost         = val('r-setup', 2500);
  var managedMonthly    = val('r-managed', 400);
  var infraMonthly      = val('r-infra', 40);

  // Derived
  var bookingCallsPerWk  = missedPerWeek * bookingRate;
  var recoveredResPerWk  = bookingCallsPerWk * convRate;
  var recoveredCoversPerWk = recoveredResPerWk * coversPerRes;
  var recoveredRevPerWk  = recoveredCoversPerWk * ticketPerCover;
  var recoveredRevPerYr  = recoveredRevPerWk * 52;

  var totalMonthlyCost   = managedMonthly + infraMonthly;
  var total12Mo          = setupCost + (totalMonthlyCost * 12);

  // Payback: how many months until cumulative recovered revenue >= setup cost
  var paybackMo = (managedMonthly + infraMonthly > 0 || setupCost > 0)
    ? (recoveredRevPerWk * 4.33 > 0
        ? Math.ceil(setupCost / (recoveredRevPerWk * 4.33))
        : null)
    : null;

  var netAnnual = recoveredRevPerYr - total12Mo;

  output.innerHTML = [
    '<div class="roi-calc__results">',

    '  <div class="roi-calc__result-grid">',

    '    <div class="roi-calc__result-card roi-calc__result-card--highlight">',
    '      <div class="roi-calc__result-label">Estimated recovered revenue / year</div>',
    '      <div class="roi-calc__result-value">' + fmt(recoveredRevPerYr) + '</div>',
    '      <div class="roi-calc__result-note">',
    '        ' + Math.round(recoveredCoversPerWk) + ' covers/week × ' + fmt(ticketPerCover) + ' avg ticket × 52 weeks',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__result-card">',
    '      <div class="roi-calc__result-label">Voice AI total cost — 12 months</div>',
    '      <div class="roi-calc__result-value">' + fmt(total12Mo) + '</div>',
    '      <div class="roi-calc__result-note">',
    '        ' + fmt(setupCost) + ' setup + (' + fmtMo(managedMonthly) + ' managed + ' + fmtMo(infraMonthly) + ' infra) × 12',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__result-card ' + (netAnnual > 0 ? 'roi-calc__result-card--positive' : 'roi-calc__result-card--caution') + '">',
    '      <div class="roi-calc__result-label">Estimated net at 12 months</div>',
    '      <div class="roi-calc__result-value">' + fmt(netAnnual) + '</div>',
    '      <div class="roi-calc__result-note">Recovered revenue minus total voice AI cost</div>',
    '    </div>',

    '  </div>',

    '  <div class="roi-calc__breakdown">',
    '    <div class="roi-calc__breakdown-label">How we got there</div>',
    '    <div class="roi-calc__breakdown-row"><span>' + missedPerWeek + ' missed calls/wk</span><span>your input</span></div>',
    '    <div class="roi-calc__breakdown-row"><span>× ' + Math.round(bookingRate * 100) + '% booking attempts</span><span>' + Math.round(bookingCallsPerWk * 10) / 10 + ' calls/wk were potential reservations</span></div>',
    '    <div class="roi-calc__breakdown-row"><span>× ' + Math.round(convRate * 100) + '% answer→book conversion</span><span>' + Math.round(recoveredResPerWk * 10) / 10 + ' additional reservations/wk</span></div>',
    '    <div class="roi-calc__breakdown-row"><span>× ' + coversPerRes + ' covers/reservation</span><span>' + Math.round(recoveredCoversPerWk * 10) / 10 + ' additional covers/wk</span></div>',
    '    <div class="roi-calc__breakdown-row"><span>× ' + fmt(ticketPerCover) + ' avg ticket</span><span>' + fmt(recoveredRevPerWk) + '/wk · ' + fmt(recoveredRevPerYr) + '/yr</span></div>',
    (paybackMo !== null
      ? '    <div class="roi-calc__breakdown-row roi-calc__breakdown-row--total"><span>Setup payback period</span><span>~' + paybackMo + ' month' + (paybackMo === 1 ? '' : 's') + '</span></div>'
      : ''),
    '  </div>',

    '</div>'
  ].join('\n');
}

/* ── 2. VA REPLACEMENT / 12-MONTH TCO CALCULATOR ── */

function initVACalc() {
  var container = el('va-roi-calc');
  if (!container) return;

  container.innerHTML = [
    '<div class="roi-calc" aria-label="VA replacement 12-month TCO estimator">',

    '  <div class="roi-calc__header">',
    '    <h3 class="roi-calc__title">12-Month Total Cost Comparison</h3>',
    '    <p class="roi-calc__subtitle">',
    '      Enter your actual VA spend and hours. Change any assumption to fit your situation.',
    '    </p>',
    '    <div class="roi-calc__honest-note">',
    '      <strong>ESTIMATE.</strong> The illustrative scenario on this page uses industry-average numbers.',
    '      This version uses your numbers. Every assumption is visible and editable.',
    '    </div>',
    '  </div>',

    '  <div class="roi-calc__inputs">',

    '    <div class="roi-calc__section-label">Your current VA situation</div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-va-monthly" class="roi-calc__label">',
    '        Monthly VA cost (all-in)',
    '        <span class="roi-calc__hint">Wage + any platform fee + benefits. Total you pay per month.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="v-va-monthly" class="roi-calc__input" type="number" min="0" value="800">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-oversight-hrs" class="roi-calc__label">',
    '        Your oversight hours per week',
    '        <span class="roi-calc__hint">Time spent reviewing VA work, handling exceptions, re-training. Be honest.</span>',
    '      </label>',
    '      <input id="v-oversight-hrs" class="roi-calc__input" type="number" min="0" value="3">',
    '    </div>',

    '    <div class="roi-calc__section-label">Assumptions — edit these</div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-your-rate" class="roi-calc__label">',
    '        Your hourly opportunity cost',
    '        <span class="roi-calc__hint">What your time is worth. If you bill at $100/hr or earn $80K/yr (~$38/hr), use that. Conservative default: $75/hr.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="v-your-rate" class="roi-calc__input" type="number" min="1" value="75">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-churn-prob" class="roi-calc__label">',
    '        Probability your VA churns this year (%)',
    '        <span class="roi-calc__hint">Industry average for offshore direct-hire is ~55% annual turnover. Use 0% if your VA is stable.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <input id="v-churn-prob" class="roi-calc__input" type="number" min="0" max="100" value="55">',
    '        <span class="roi-calc__unit">%</span>',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-retrain-wks" class="roi-calc__label">',
    '        Weeks to retrain a replacement (if churn occurs)',
    '        <span class="roi-calc__hint">Typical: 2–4 weeks of your time. Default: 3.</span>',
    '      </label>',
    '      <input id="v-retrain-wks" class="roi-calc__input" type="number" min="0" value="3">',
    '    </div>',

    '    <div class="roi-calc__section-label">Build + automation cost (Baxter Solutions)</div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-build-cost" class="roi-calc__label">',
    '        Build cost (one-time)',
    '        <span class="roi-calc__hint">Single workflow: $7,500. Multi-workflow: $15,000–$35,000. Use the audit estimate if you have one.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="v-build-cost" class="roi-calc__input" type="number" min="0" value="7500">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-infra-monthly" class="roi-calc__label">',
    '        Monthly infrastructure (n8n hosting, API costs)',
    '        <span class="roi-calc__hint">Estimate: $80–$150/mo depending on workflow volume. Default: $100.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="v-infra-monthly" class="roi-calc__input" type="number" min="0" value="100">',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__row">',
    '      <label for="v-retainer-monthly" class="roi-calc__label">',
    '        Monthly retainer (optional — Care $800 / Operate $1,500)',
    '        <span class="roi-calc__hint">$0 if you plan to maintain the system yourself. System runs without us either way.</span>',
    '      </label>',
    '      <div class="roi-calc__input-with-unit">',
    '        <span class="roi-calc__unit">$</span>',
    '        <input id="v-retainer-monthly" class="roi-calc__input" type="number" min="0" value="0">',
    '      </div>',
    '    </div>',

    '  </div>',

    '  <div class="roi-calc__output" id="v-output" aria-live="polite" aria-label="Calculation results">',
    '    <!-- populated by calcVA() -->',
    '  </div>',

    '  <p class="roi-calc__disclaimer">',
    '    ESTIMATE — not a financial projection. VA turnover probability, retraining weeks, and oversight',
    '    hours are editable estimates. The audit produces a version of this comparison using your actual',
    '    task list and confirmed numbers.',
    '  </p>',

    '</div>'
  ].join('\n');

  var inputs = container.querySelectorAll('.roi-calc__input');
  inputs.forEach(function(input) {
    input.addEventListener('input', calcVA);
  });

  calcVA();
}

function calcVA() {
  var output = el('v-output');
  if (!output) return;

  var vaMonthly       = val('v-va-monthly', 800);
  var oversightHrsWk  = val('v-oversight-hrs', 3);
  var yourRate        = val('v-your-rate', 75);
  var churnProb       = val('v-churn-prob', 55) / 100;
  var retrainWks      = val('v-retrain-wks', 3);
  var buildCost       = val('v-build-cost', 7500);
  var infraMonthly    = val('v-infra-monthly', 100);
  var retainerMonthly = val('v-retainer-monthly', 0);

  // VA 12-month costs
  var vaDirect12     = vaMonthly * 12;
  var oversightAnnual = oversightHrsWk * yourRate * 52;
  // Expected retraining cost = probability × weeks × hrs/week (assume 40hr weeks for owner's time at their rate)
  var retrainCost    = churnProb * retrainWks * 40 * yourRate;
  var vaTotal12      = vaDirect12 + oversightAnnual + retrainCost;

  // Automation 12-month costs
  var automationInfra12   = infraMonthly * 12;
  var automationRetainer12 = retainerMonthly * 12;
  var automationTotal12   = buildCost + automationInfra12 + automationRetainer12;

  // Savings
  var savings12      = vaTotal12 - automationTotal12;

  // Payback: months until automation total < cumulative VA cost
  // After buildCost is spent, monthly delta = vaMonthly - (infraMonthly + retainerMonthly)
  var monthlyDelta = vaMonthly - infraMonthly - retainerMonthly;
  var paybackMo = (monthlyDelta > 0)
    ? Math.ceil(buildCost / monthlyDelta)
    : null;

  output.innerHTML = [
    '<div class="roi-calc__results">',

    '  <div class="roi-calc__result-grid roi-calc__result-grid--2col">',

    '    <div class="roi-calc__result-col">',
    '      <div class="roi-calc__result-col-label">VA — 12-month total</div>',
    '      <div class="roi-calc__result-col-value roi-calc__result-col-value--va">' + fmt(vaTotal12) + '</div>',
    '      <div class="roi-calc__result-breakdown-mini">',
    '        <div>' + fmt(vaDirect12) + ' direct labor</div>',
    '        <div>+ ' + fmt(oversightAnnual) + ' oversight (' + oversightHrsWk + 'hr/wk × ' + fmt(yourRate) + '/hr × 52)</div>',
    '        <div>+ ' + fmt(Math.round(retrainCost)) + ' expected retraining (' + Math.round(churnProb * 100) + '% churn × ' + retrainWks + ' wks)</div>',
    '      </div>',
    '    </div>',

    '    <div class="roi-calc__result-col">',
    '      <div class="roi-calc__result-col-label">Automation — 12-month total</div>',
    '      <div class="roi-calc__result-col-value roi-calc__result-col-value--auto">' + fmt(automationTotal12) + '</div>',
    '      <div class="roi-calc__result-breakdown-mini">',
    '        <div>' + fmt(buildCost) + ' build (one-time)</div>',
    '        <div>+ ' + fmt(automationInfra12) + ' infra (' + fmtMo(infraMonthly) + ' × 12)</div>',
    (retainerMonthly > 0
      ? '        <div>+ ' + fmt(automationRetainer12) + ' retainer (' + fmtMo(retainerMonthly) + ' × 12)</div>'
      : '        <div>+ $0 retainer (self-managed)</div>'),
    '      </div>',
    '    </div>',

    '  </div>',

    '  <div class="roi-calc__result-grid">',

    '    <div class="roi-calc__result-card ' + (savings12 > 0 ? 'roi-calc__result-card--positive' : 'roi-calc__result-card--caution') + '">',
    '      <div class="roi-calc__result-label">Estimated 12-month difference</div>',
    '      <div class="roi-calc__result-value">' + (savings12 >= 0 ? fmt(savings12) + ' savings' : '(' + fmt(Math.abs(savings12)) + ') higher cost') + '</div>',
    '      <div class="roi-calc__result-note">Automation vs. continuing with VA over 12 months</div>',
    '    </div>',

    (paybackMo !== null
      ? [
          '    <div class="roi-calc__result-card">',
          '      <div class="roi-calc__result-label">Build cost payback period</div>',
          '      <div class="roi-calc__result-value">~' + paybackMo + ' month' + (paybackMo === 1 ? '' : 's') + '</div>',
          '      <div class="roi-calc__result-note">Months until monthly VA savings cover the one-time build cost (' + fmt(buildCost) + ' ÷ ' + fmtMo(monthlyDelta) + ' net monthly savings)</div>',
          '    </div>'
        ].join('\n')
      : [
          '    <div class="roi-calc__result-card roi-calc__result-card--caution">',
          '      <div class="roi-calc__result-label">Payback period</div>',
          '      <div class="roi-calc__result-value">N/A</div>',
          '      <div class="roi-calc__result-note">Monthly automation cost exceeds VA cost at these inputs — the build doesn\'t pencil out here. The audit would tell you why.</div>',
          '    </div>'
        ].join('\n')
    ),

    '  </div>',

    '</div>'
  ].join('\n');
}

/* ── INIT ON DOM READY ── */

function initCalcs() {
  initRestaurantCalc();
  initVACalc();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalcs);
} else {
  initCalcs();
}
