import { useState } from "react";

const LOGOS = {
  // WIG20
  "PKN":  "orlen.pl",
  "PKO":  "pkobp.pl",
  "PZU":  "pzu.pl",
  "KGH":  "kghm.pl",
  "CDR":  "cdprojekt.com",
  "LPP":  "lppsa.com",
  "ALE":  "allegro.eu",
  "PEO":  "pekao.com.pl",
  "DNP":  "dinopolska.pl",
  "SPL":  "santander.pl",
  "PGE":  "gkpge.pl",
  "MBK":  "mbank.pl",
  "OPL":  "orange.pl",
  "KRU":  "kruk.eu",
  "KTY":  "grupakety.pl",
  "BDX":  "budimex.pl",
  "CCC":  "ccc.eu",
  "PCO":  "pepcogroup.com",
  "ALR":  "aliorbank.pl",
  "ZAB":  "zabka.pl",
  // mWIG40
  "ING":  "ing.pl",
  "CPS":  "cyfrowypolsat.pl",
  "TPE":  "tauron.pl",
  "ACP":  "asseco.pl",
  "MIL":  "bankmillennium.pl",
  "BHW":  "citihandlowy.pl",
  "BFT":  "benefitsystems.pl",
  "CMR":  "comarch.pl",
  "DOM":  "domdev.pl",
  "ENA":  "enea.pl",
  "EUR":  "eurocash.pl",
  "GPW":  "gpw.pl",
  "XTB":  "xtb.com",
  "TXT":  "text.com",
  "WPL":  "wp.pl",
  "ASE":  "asseco-see.com",
  "LWB":  "lw.com.pl",
  "CAR":  "intercars.pl",
  "JSW":  "jsw.pl",
  "EAT":  "amrest.eu",
  "PHN":  "phn.com.pl",
  "GRN":  "grenevia.com",
  "NEU":  "neuca.pl",
  "MBR":  "mo-bruk.pl",
  "ATT":  "grupaazoty.pl",
  "MRC":  "mercatormedical.pl",
  "1AT":  "atal.pl",
  "PLW":  "playway.com",
  "DVL":  "develia.pl",
  "CIG":  "cigames.com",
  "UNI":  "unimot.pl",
  "GTC":  "gtc.com.pl",
  "BNP":  "bnpparibas.pl",
  "GPP":  "pracuj.pl",
  "PEP":  "polenergia.pl",
  // sWIG80
  "VGO":  "vigophotonics.com",
  "WAR":  "wawel.com.pl",
  "SNK":  "sanok-rubber.com",
  "SLV":  "selvita.com",
  "11B":  "11bitstudios.com",
  "HUG":  "huuuge.com",
  "TEN":  "tensquaregames.com",
  "ZEP":  "zepak.com.pl",
  "VRG":  "vrg.pl",
  "ABS":  "asseco-bs.pl",
  "AGO":  "agora.pl",
  "AMC":  "amica.pl",
  "BIO":  "bioton.pl",
  "ECH":  "echo.com.pl",
  "CIE":  "ciech.com",
  "OPN":  "oponeo.pl",
  "ATC":  "arcticpaper.com",
  "PKP":  "pkpcargo.com",
  "SWG":  "sniezka.pl",
  "KER":  "kernel.ua",
  "ENT":  "enterair.pl",
  "WLT":  "wielton.com",
  "RBW":  "rainbowtours.pl",
  "APR":  "auto-partner.pl",
  "ZWC":  "grupazywiec.pl",
  // inne
  "DIAG": "diagnostyka.pl",
  "SYG":  "sygnity.pl",
  "NWG":  "newag.pl",
  "ASB":  "asbis.com",
  "STS":  "sts.pl",
  "VRC":  "vercom.pl",
  "DAT":  "datawalk.com",
  "MLP":  "mlpgroup.com",
  "R22":  "r22.pl",
  "ENG":  "energa.pl",
  "SPH":  "spyrosoft.com",
  "KRK":  "krka.eu",
  "ARC":  "archicom.pl",
  "RVU":  "ryvu.com",
  "SHO":  "shoper.pl",
  "APT":  "apator.com",
  "BRS":  "boryszew.pl",
  "AMB":  "ambra.com.pl",
  "TIM":  "tim.pl",
  "NET":  "netia.pl",
  "MNC":  "mennica.pl",
  "PCC":  "pcc.eu",
};

export default function StockLogo({ ticker, size = 28, borderRadius = 6 }) {
  const [failed, setFailed] = useState(false);
  const domain = LOGOS[ticker];

  if (domain && !failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(88,166,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={ticker}
          onError={() => setFailed(true)}
          style={{ width: "85%", height: "85%", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius,
      background: "linear-gradient(135deg, #1f6feb22, #58a6ff33)",
      border: "1px solid #58a6ff44",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.32), fontWeight: 800, color: "#58a6ff", flexShrink: 0,
    }}>
      {ticker.slice(0, 2)}
    </div>
  );
}
