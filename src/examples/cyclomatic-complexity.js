function preparePies(redRidingHood, packA, packB, pies) {
  const parcel = [];
  for (let i = 0; i < pies.length; i++) {
    let pie = null;
    switch (pies[i].type) {
      case 'HINKAL': pie = packA(pies[i]); break;
      case 'CHEBUREK':
      case 'PIE': pie = packB(pies[i]); break;
    }
    if (pie) { parcel.push(pie); }
  }
  if (parcel.length) {
    redRidingHood.carry(parcel);
  }
}
