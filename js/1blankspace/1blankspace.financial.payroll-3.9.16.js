/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 */

ns1blankspace.financial.payroll = 
{
	data: 	{
					context: 'pays',
					payPeriods: ['Not Set', 'Weekly', 'Fortnightly', 'Monthly', 'Bi-Monthly']
				},

	init: 	function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 37;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'payroll';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Payroll';
					ns1blankspace.objectMethod = 'FINANCIAL_PAYROLL_PAY_PERIOD';

					if (ns1blankspace.session.route != undefined)
					{
						if (ns1blankspace.session.route['ns1blankspace.financial.payroll'] != undefined)
						{
							oParam = ns1blankspace.session.route['ns1blankspace.financial.payroll'].param;
							ns1blankspace.session.route['ns1blankspace.financial.payroll'] = undefined;
						}
					}

					ns1blankspace.financial.payroll.data._param = oParam;

					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{	
						if (ns1blankspace.financial.payroll.data.linetypes == undefined)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.init)
							ns1blankspace.financial.payroll.util.linetypes.init(oParam);
						}
						else
						{	
							oParam.bind = ns1blankspace.financial.payroll.bind;

							oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
												'<tr class="ns1blankspaceOptions">' +
												'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
												'Delete' +
												'</td></tr>' +
												'<tr class="ns1blankspaceOptions">' +
												'<td id="ns1blankspaceControlActionOptionsComplete" class="ns1blankspaceViewControl">' +
												'Complete' +
												'</td></tr>' +
												'</table>';

							ns1blankspace.app.set(oParam);					

							$('#ns1blankspaceViewControlNew').unbind('click');

							$('#ns1blankspaceViewControlNew').click(function(event)
							{
								ns1blankspace.financial.payroll["new"].show()
							});
						}	
					}
				},

	bind: 	function (oParam)
				{
					$('#ns1blankspaceControlActionOptionsRemove')
					.click(function() 
					{
						ns1blankspace.app.options.remove(oParam)
					});

					$('#ns1blankspaceControlActionOptionsComplete')
					.click(function() 
					{
						ns1blankspace.app.options.hide();
						ns1blankspace.financial.payroll.complete({step: 1});
					});
				},			

	home:		{
					show: 	function (oParam, oResponse)
								{
									var aHTML = [];
													
									aHTML.push('<table>');

									aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
										
									aHTML.push('<tr><td id="ns1blankspaceControl-pays" class="ns1blankspaceControl" style="padding-top:12px;">' +
													'Pay Runs</td></tr>');			
											
									aHTML.push('<tr><td id="ns1blankspaceControl-employees" class="ns1blankspaceControl">' +
													'Employees</td></tr>');	
												
									aHTML.push('</table>');	

									aHTML.push('<table class="ns1blankspaceControl">');
									
									aHTML.push('<tr class="ns1blankspaceControl">' +
												'<td id="ns1blankspaceControl_totals" class="ns1blankspaceControl">Totals' +
												'<br /><div class="ns1blankspaceSubNote">pay summaries</div></td>' +
												'</tr>');

									if (ns1blankspace.util.hasAccess({method: 'financial_expense_search'}))
									{
										aHTML.push('<tr class="ns1blankspaceControl">' +
												'<td id="ns1blankspaceControl_superannuation" class="ns1blankspaceControl" style="padding-top:6px;">Superannuation' +
												'<br /><div class="ns1blankspaceSubNote">to be paid</div></td>' +
												'</tr>');
									}

									aHTML.push('<tr class="ns1blankspaceControl">' +
												'<td id="ns1blankspaceControl_insurance" class="ns1blankspaceControl" style="padding-top:6px;">Insurance' +
												'<br /><div class="ns1blankspaceSubNote">workers compensation</div></td>' +
												'</tr>');

									if (ns1blankspace.util.hasAccess({method: 'financial_item_search'}))
									{
										aHTML.push('<tr class="ns1blankspaceControl">' +
												'<td id="ns1blankspaceControl_dashboard" class="ns1blankspaceControl" style="padding-top:6px;">Summary' +
												'<br /><div class="ns1blankspaceSubNote">for analysis</div></td>' +
												'</tr>');
									}

									aHTML.push('<tr class="ns1blankspaceControl">' +
												'<td id="ns1blankspaceControl_leave" class="ns1blankspaceControl" style="padding-top:6px;">Leave' +
												'</td>' +
												'</tr>');
																					
									aHTML.push('</table>');
									
									$('#ns1blankspaceControl').html(aHTML.join(''));

									$('#ns1blankspaceControl-pays').click(function(event)
									{
										$('#ns1blankspaceViewControlNew').button({disabled: false});
										ns1blankspace.show({selector: '#ns1blankspaceMainPayRun', refresh: true, context: {inContext: false, action: true, actionOptions: true}});
										ns1blankspace.financial.payroll.home.show();
									});
								
									$('#ns1blankspaceControl-employees').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true, context: {inContext: false, action: true, actionOptions: true}});
										ns1blankspace.financial.payroll.employees.show();
									});

									$('#ns1blankspaceControl_totals').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainTotals', refresh: true});
										ns1blankspace.financial.payroll.totals.init();
									});

									$('#ns1blankspaceControl_superannuation').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainSuperannuation', refresh: true});
										ns1blankspace.financial.payroll.superannuation.init();
									});

									$('#ns1blankspaceControl_insurance').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainInsurance', refresh: true});

										ns1blankspace.financial.payroll.superannuation.urls(
										{
											onComplete: ns1blankspace.financial.payroll.insurance.init
										});
									});

									$('#ns1blankspaceControl_dashboard').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainDashboard', refresh: true});
										ns1blankspace.financial.payroll.dashboard.init();
									});

									$('#ns1blankspaceControl_leave').click(function(event)
									{
										ns1blankspace.show({selector: '#ns1blankspaceMainLeave', refresh: true});
										ns1blankspace.financial.payroll.leave.show();
									});
									
									var aHTML = [];
									
									aHTML.push('<div id="ns1blankspaceMainPayRun" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainEmployee" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainTotals" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainSuperannuation" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainNew" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainInsurance" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainDashboard" class="ns1blankspaceControlMain"></div>');
									aHTML.push('<div id="ns1blankspaceMainLeave" class="ns1blankspaceControlMain"></div>');

									$('#ns1blankspaceMain').html(aHTML.join(''));
								

									var aHTML = [];
									
									aHTML.push('<div id="ns1blankspaceMainPayRunFrequencyContainer" style="display:none;"></div>');
									aHTML.push('<div id="ns1blankspaceMainPayRunContainer">' + ns1blankspace.xhtml.loading + '</div>');
									aHTML.push('<div id="ns1blankspaceMainPayRunDashboardContainer"></div>');

									$('#ns1blankspaceMainPayRun').html(aHTML.join(''));

									ns1blankspace.financial.payroll.home.dashboard.init(oParam);
								},

					process: function (oParam, oResponse)
								{		
									var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": false}).value;
									var bShowTotals = ns1blankspace.util.getParam(oParam, 'showTotals', {"default": false}).value;
									var bShowPay = ns1blankspace.util.getParam(oParam, 'showPay', {"default": false}).value;

									var iFrequency = ns1blankspace.financial.payroll.data.payFrequency;
									if (iFrequency == undefined) {iFrequency = ns1blankspace.financial.payroll.data.defaultPayFrequency}
								
									if (oResponse == undefined)
									{		
										if (bNew)
										{
											ns1blankspace.financial.payroll["new"].show();
										}
										else if (bShowTotals)
										{
											ns1blankspace.financial.payroll.data.context = 'totals';
											$('td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
											$('#ns1blankspaceControl_totals').addClass('ns1blankspaceHighlight');
											ns1blankspace.show({selector: '#ns1blankspaceMainTotals', refresh: true});
											
											if (oParam.payPeriod != undefined)
											{
												ns1blankspace.financial.payroll.data.payPeriod = oParam.payPeriod;
												ns1blankspace.financial.payroll.data.isFinalForYear = oParam.isFinalForYear;
											}
											
											ns1blankspace.financial.payroll.totals.init(oParam);
										}
										else if (bShowPay)
										{
											ns1blankspace.financial.payroll.data.context = 'pays';
											$('td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
											$('#ns1blankspaceControl-pays').addClass('ns1blankspaceHighlight');
											ns1blankspace.show({selector: '#ns1blankspaceMainPayRun', refresh: true});
											ns1blankspace.financial.payroll.search.send(oParam.xhtmlElementID, {source: 1});
										}
										else
										{
											ns1blankspace.financial.payroll.data.context = 'pays';

											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('startdate,paydate,statustext,guid');
											oSearch.addFilter('frequency', 'EQUAL_TO', iFrequency);
											oSearch.sort('paydate', 'desc');	
											oSearch.getResults(function(data){ns1blankspace.financial.payroll.home.process(oParam, data)});
										}

										$('#ns1blankspaceControl-' + ns1blankspace.financial.payroll.data.context).addClass('ns1blankspaceHighlight');
									}
									else
									{
										var aHTML = [];
									
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="ns1blankspaceMostLikely">');
											aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to create a pay run.</td></tr>');
											aHTML.push('</table>');
										}
										else
										{	
											aHTML.push('<table id="ns1blankspaceMostLikely">');

											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:100px;">Pay Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:120px;">Start Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:130px;">Status</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">' + ns1blankspace.option.taxOffice + ' STP Reporting Status</td>');
											aHTML.push('<tr>')
	
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.home.row(this, oParam));
											});
											
											aHTML.push('</table>');
										}
			
										ns1blankspace.render.page.show(
										{
											type: 'JSON',
											xhtmlElementID: 'ns1blankspaceMainPayRunContainer',
											xhtmlContext: 'MostLikely',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.financial.payroll.home.row,
											functionOpen: undefined,
											functionOnNewPage: ns1blankspace.financial.payroll.home.bind,
											headerRow: true
										});

											
									}
								},

					row: 		function (oRow, oParam)	
								{
									var aHTML = [];
									aHTML.push('<tr class="ns1blankspaceRow">');
									aHTML.push('<td id="ns1blankspaceMostLikely_paydate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" style="width:150px;">' +
																		oRow["paydate"] + '</td>');

									aHTML.push('<td id="ns1blankspaceMostLikely_startdate-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																		oRow["startdate"] + '</td>');
												
									aHTML.push('<td id="ns1blankspaceMostLikely_status-' + oRow.id + '" class="ns1blankspaceRow  ns1blankspaceSub">' +
																		oRow.statustext + '</td>');

									aHTML.push('<td style="text-align:left;" class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceMostLikely_totals-' + oRow.id + '"' +
													' data-startdate="' + oRow["startdate"] + '"' +
													' data-paydate="' + oRow["paydate"] + '"' +
													' data-guid="' + oRow["guid"] + '"' +
													' data-id="' + oRow["id"] + '"' +  
													' class="ns1blankspaceRowTotals"></td>');
									aHTML.push('</tr>');

									return aHTML.join('');
								},

					bind: 	function (oParam)	
								{
									$('.ns1blankspaceRowSelect').click(function(event)
									{
										ns1blankspace.financial.payroll.search.send(this.id, {source: 1});
									});

									var aIDs = $.map($('#' + oParam.xhtmlContainerID + ' [data-id]'), function (e) {return $(e).data('id')})

									ns1blankspace.financial.payroll.totals.employees.report.history.show({objectContexts: aIDs})
								},

					dashboard:
								{
									init: function (oParam)
									{
										ns1blankspace.financial.payroll.home.dashboard.payFrequencies(oParam);
									},

									payFrequencies: function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('payfrequency,payfrequencytext,count(id) count');
											oSearch.rows = 999;
											oSearch.sort('payfrequency', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.home.dashboard.payFrequencies(oParam, data)});
										}
										else
										{
											ns1blankspace.financial.payroll.data.employeePayFrequencies = oResponse.data.rows;

											if (ns1blankspace.financial.payroll.data.employeePayFrequencies.length > 0)
											{
												ns1blankspace.financial.payroll.data.defaultPayFrequency = _.first(ns1blankspace.financial.payroll.data.employeePayFrequencies).payfrequency

												$vq.clear({queue: 'dashboard'});
												$vq.clear({queue: 'options'});

												$vq.add('<div class="well well-sm text-muted" style="width:475px; font-size:0.825em; margin-top:20px; text-align:left;">' + 
															'<div style="font-size:1 em;"><strong><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></strong></div>' +
															'<div>The default pay run is ' + ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod].toLowerCase() + '.</div>' +
															'<div>There '
															, {queue: 'dashboard'});

												$vq.add('<div class="btn-group" role="group" data-toggle="buttons" id="ns1blankspaceMainPayRunFrequencyOption" ' +
															'style="margin-top:3px; margin-bottom:10px; text-align:right;">'
															, {queue: 'options'});

												$.each(oResponse.data.rows, function (r, row)
												{
													if (r == 0)
													{
														if (row.count == 1)
														{
															$vq.add(' is one employee on ' + row.payfrequencytext.toLowerCase()
																, {queue: 'dashboard'});
														}
														else
														{
															$vq.add(row.count + ' are employees on ' + row.payfrequencytext.toLowerCase()
																, {queue: 'dashboard'});
														}
													}
													else if (r == oResponse.data.rows.length - 1)
													{
														$vq.add(' & ' + row.count + ' on ' + row.payfrequencytext.toLowerCase()
															, {queue: 'dashboard'});
													}
													else 
													{
														$vq.add(', ' + row.count + ' on ' + row.payfrequencytext.toLowerCase()
															, {queue: 'dashboard'});
													}

													$vq.add('<label class="btn btn-default btn-sm" id="ns1blankspaceMainPayRunFrequencyOption-' + row.payfrequency + '">' +
																	'<input type="radio" name="ns1blankspaceMainPayRunFrequencyOption" data-1blankspace="ignore" />' + row.payfrequencytext + 
																	'</label>'
																	, {queue: 'options'});

												});

												$vq.add('.'
															, {queue: 'dashboard'});

												$vq.render('#ns1blankspaceMainPayRunDashboardContainer', {queue: 'dashboard'});

												$vq.add('</div>'
															, {queue: 'options'});

												if (oResponse.data.rows.length > 1)
												{
													$vq.render('#ns1blankspaceMainPayRunFrequencyContainer', {queue: 'options'});
													$('#ns1blankspaceMainPayRunFrequencyContainer').css('display', 'block');
												
													var iFrequency = ns1blankspace.financial.payroll.data.payFrequency;
													if (iFrequency == undefined) {iFrequency = ns1blankspace.financial.payroll.data.defaultPayFrequency}

													var sSelect = 'label'
													if (!ns1blankspace.option.bootstrap)
													{
														$('#ns1blankspaceMainPayRunFrequencyOption').buttonset().css('font-size', '0.825em');
														sSelect = ':radio'
													}
													else
													{
														$('#ns1blankspaceMainPayRunFrequencyOption-' + iFrequency).addClass('active');
													}

													$('#ns1blankspaceMainPayRunFrequencyOption-' + iFrequency).attr('checked', 'checked');
																
													$('#ns1blankspaceMainPayRunFrequencyOption ' + sSelect).click(function()
													{
														var aID = (this.id).split('-');
														ns1blankspace.financial.payroll.data.payFrequency = parseInt(aID[1]);
														$.extend(true, oParam, {frequency: parseInt(aID[1])});
														ns1blankspace.financial.payroll.home.show(oParam);
													});
												}
											}

											ns1blankspace.financial.payroll.home.process(oParam)
										}
									}
								}
				},

	search: 	{
					send:		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
										if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
										if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
									}
									
									if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
										oSearch.addField('startdate,paydate,statustext,status,notes,modifieddate,frequency,frequencytext');
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.show(oParam, data)});
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#ns1blankspaceViewControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											var aSearch = sSearch.split('-');
											sSearchText = aSearch[1];
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('notes,paydate');
											oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);

											var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
  											if (oSearchDate.isValid())
											{
												oSearch.addOperator('or');
												oSearch.addBracket('(');
												oSearch.addFilter('startdate', 'LESS_THAN_OR_EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												oSearch.addOperator('and');
												oSearch.addFilter('paydate', 'GREATER_THAN_OR_EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
												oSearch.addBracket(')');
											}

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('paydate', 'DESC');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;
											
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.search.process(oParam, data)});	
										}
									};	
								},	

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{		
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.paydate +
															'</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												header: false
											}) 
										);		
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.payroll.search.send(this.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'paydate',
											more: oResponse.moreid,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.payroll.search.send
										});   
									}		
								}
				},				

	layout: 	function ()
				{
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');			
					}
					else
					{
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlPays" class="ns1blankspaceControl">' +
										'Pays</td></tr>');		
					}					

					if (ns1blankspace.objectContext != -1)
					{
						if (ns1blankspace.objectContextData.status == 2)
						{
							aHTML.push('<tr><td id="ns1blankspaceControlExpenses" class="ns1blankspaceControl">' +
										'Financials<br /><div class="ns1blankspaceSubNote">Expenses & journals</div></td></tr>' +
										'</table>');

							aHTML.push('<table class="ns1blankspaceControl">' +
										'<tr class="ns1blankspaceControl">' +
										'<td id="ns1blankspaceControlTotals" class="ns1blankspaceControl">Totals' +
										'<br /><div class="ns1blankspaceSubNote">& pay slips</div></td>' +
										'</tr>');
						}

						aHTML.push('</table>');

						aHTML.push('<table class="ns1blankspaceControl">');

						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');	
					}

					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPays" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainExpenses" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPayTotals" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.payroll.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.payroll.details();
					});
					
					$('#ns1blankspaceControlPays').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPays', refresh: true});
						ns1blankspace.financial.payroll.pays();
					});

					$('#ns1blankspaceControlTotals').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPayTotals'});
						ns1blankspace.financial.payroll.pays.totals.show();
					});

					$('#ns1blankspaceControlExpenses').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainExpenses'});
						ns1blankspace.financial.payroll.financials.show();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
					});
				},

	show: 		function (oParam, oResponse)
				{	
					ns1blankspace.app.clean();
						
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this pay run.</td></tr></table>');
								
						$('#ns1blankspaceControl').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						ns1blankspace.financial.payroll.layout();

						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.paydate +
							'<br /><span class="ns1blankspaceSub" style="font-weight:300">' + ns1blankspace.objectContextData.startdate  + '</span>' +
							'<br /><span id="ns1blankspaceSub_frequency" class="ns1blankspaceSub">' + (ns1blankspace.objectContextData.frequencytext).toLowerCase() + ' pay</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.payroll.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.payroll.summary()'})
					}
				},

	summary: function (oParam, oResponse)
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this contact.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:270px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Start Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryStartDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.startdate +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">End Date</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryEndDate" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.paydate +
										'</td></tr>');
				
						aHTML.push('</table>');					

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2" style="width: 100%;">');
						
						if (ns1blankspace.objectContextData.statustext != '')
						{	
							aHTML.push('<tr><td class="ns1blankspaceCaption" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');				
						}
						
						if (ns1blankspace.objectContextData.status == 1)
						{	
							aHTML.push('<tr><td>' +
										'<span style="font-size:0.75em;" id="ns1blankspaceStatusComplete">Complete</span>' +
										'</td></tr>');			
						}

						if (true || ns1blankspace.objectContextData.status == 2)
						{
							aHTML.push('<tr><td class="ns1blankspaceRowSelect" style="padding-top:18px;"><div id="ns1blankspaceSummaryTotals"' +
													' data-startdate="' + ns1blankspace.objectContextData.startdate + '"' +
													' data-paydate="' + ns1blankspace.objectContextData.paydate + '"' +
													' data-guid="' + ns1blankspace.objectContextData.guid + '"' +
													' data-id="' + ns1blankspace.objectContextData.id + '"' +  
													' >Totals & ' + ns1blankspace.option.taxOffice + ' Reporting</div>' +
													'<div class="ns1blankspaceSubNote">Including Single Touch Payroll</div></td></tr>');
						}
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	

						$('#ns1blankspaceStatusComplete').button()
						.click(function()
						{
							ns1blankspace.financial.payroll.complete({step: 1});
						});

						$('#ns1blankspaceSummaryTotals')
						.click(function()
						{
							var oData = $(this);

							$('td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
							$('#ns1blankspaceControl_totals').addClass('ns1blankspaceHighlight');

							ns1blankspace.show({selector: '#ns1blankspaceMainTotals', refresh: true});

							ns1blankspace.financial.payroll.init(
							{
								startDate: ns1blankspace.financial.util.financialYear(oData.attr('data-paydate')).start,
								endDate: oData.attr('data-paydate'),
								guid: oData.attr('data-guid'),
								payPeriod: oData.attr('data-id'),
								showTotals: true
							});
						});
					}							
				},

	details: 	function (oParam)
				{	
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Start Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
										'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Pay Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsPayDate" class="ns1blankspaceDate">' +
										'</td></tr>');			

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
										'</td></tr>');		

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Frequency' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioFrequency1" name="radioFrequency" value="1"/>Weekly' +
										'<br /><input type="radio" id="radioFrequency2" name="radioFrequency" value="2"/>Fortnightly' +
										'<br /><input type="radio" id="radioFrequency3" name="radioFrequency" value="3"/>Monthly' +
										'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Bi/Semi Monthly' +
										'</td></tr>');		
																																											
						aHTML.push('</table>');					
					
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
					
						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});
					}	

					if (ns1blankspace.objectContextData != undefined)
					{
						$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
						$('#ns1blankspaceDetailsPayDate').val(ns1blankspace.objectContextData.paydate);
						$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
						$('[name="radioFrequency"][value="' + ns1blankspace.objectContextData.frequency + '"]').attr('checked', true);
						$('#ns1blankspaceDetailsDetailsNotes').val(ns1blankspace.objectContextData.notes);	
					}
				},

	save: 	{
					send: 	function (oParam)
								{
									if (ns1blankspace.objectContext != -1)
									{
										ns1blankspace.status.working();
										
										var sData = 'id=' + ns1blankspace.objectContext;
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&startdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsStartDate').val());
											sData += '&paydate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPayDate').val());
											sData += '&frequency=' + $('input[name="radioFrequency"]:checked').val();
											sData += '&status=' + $('input[name="radioStatus"]:checked').val();
										};

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data)
											{
												ns1blankspace.status.message('Saved.');
												ns1blankspace.inputDetected = false;
											}	
										});		
									}	
								}
				},				

	"new": 	{
					show: 	function (oParam)
								{
									var bJustSave = ns1blankspace.util.getParam(oParam, 'justSave', {"default": (ns1blankspace.financial.payroll.data.context == 'pays')}).value;

									if (bJustSave)
									{
										ns1blankspace.financial.payroll["new"].save();
									}
									else
									{
										var aHTML = [];
								
										ns1blankspace.show({selector: '#ns1blankspaceMainNew'});

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1" style="width:50%"></td>' +
														'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2"></td>' +
														'</tr>' + 
														'</table>');		

										$('#ns1blankspaceMainNew').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollNew_options_save" class="ns1blankspaceAction">Next</span>' +
															'</td></tr>' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollNew_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
															'</td></tr>');

										if (ns1blankspace.financial.payroll.data.context == 'employees')
										{
											aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:16px;">' +
															'When you click next the employee will be created as a new contact or linked to the existing one, if it exists.' +
															'</td></tr>');
										}

										aHTML.push('</table>');	

										$('#ns1blankspaceNewColumn2').html(aHTML.join(''));

										$('#ns1blankspacePayrollNew_options_save').button(
										{
											text: "Next"
										})
										.click(function() 
										{
											ns1blankspace.financial.payroll["new"].save();
										});

										$('#ns1blankspacePayrollNew_options_cancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											$('td.ns1blankspaceHighlight :first').click();
										});

										var aHTML = [];
										var h = -1;

										if (ns1blankspace.financial.payroll.data.context == 'pays')
										{
											aHTML.push('<table><tr>' + 
															'<td class="ns1blankspaceNothing">Click <b>Next</b> to create the pay period.</td>' + 
															'</tr>' +
															'</table>');
										}
										else
										{	
											aHTML.push('<table class="ns1blankspace" style="padding-right:15px;">');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'First Name' +
															'</td></tr>' +
															'<tr><td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsFirstName" data-1blankspace="ignore" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Last Name' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspaceDetailsLastName" data-1blankspace="ignore" class="ns1blankspaceText">' +
															'</td></tr>');			
											
											aHTML.push('</table>');					
										}

										$('#ns1blankspaceNewColumn1').html(aHTML.join(''));
									}
								},

					save: 	function (oParam, oResponse)
								{
									var iType;
									var iID;

									if (oParam != undefined)
									{
										if (oParam.type != undefined) {iType = oParam.type};
										if (oParam.id != undefined) {iType = oParam.id};
									}		

									if (iType == undefined)
									{	
										if ($('#ns1blankspaceControlPayRuns').hasClass('ns1blankspaceHighlight')) {iType = 1};
										if ($('#ns1blankspaceControlEmployees').hasClass('ns1blankspaceHighlight')) {iType = 2};
									}

									$('#ns1blankspaceNewColumn2').html(ns1blankspace.xhtml.loading);

									ns1blankspace.status.working('Creating Pay Run...');

									var iFrequency = ns1blankspace.financial.payroll.data.payFrequency;
									if (iFrequency == undefined) {iFrequency = ns1blankspace.financial.payroll.data.defaultPayFrequency}

									//PAYS
									if (ns1blankspace.financial.payroll.data.context == 'pays')
									{
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
											data: 'type=1&frequency=' + iFrequency,
											dataType: 'json',
											success: function(data) {
												if (data.status == 'OK')
												{	
													ns1blankspace.status.message('New pay period created.');
													ns1blankspace.objectContext = data.period;
													ns1blankspace.financial.payroll.search.send('-' + ns1blankspace.objectContext);
												}	
											}
										});
									}

									//EMPLOYEES
									if (ns1blankspace.financial.payroll.data.context == 'employees')
									{
										var iContactBusiness = ns1blankspace.spaceContactBusiness;
										if (iContactBusiness == undefined) {iContactBusiness = ns1blankspace.user.contactBusiness};

										if (iID == undefined)
										{	
											if (oResponse == undefined)
											{	
												if ($('#ns1blankspaceDetailsFirstName').val() == '' ||
													$('#ns1blankspaceDetailsLastName').val() == '')
												{
													ns1blankspace.status.error('Missing information.');
												}	
												else
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_PERSON_SEARCH';
													oSearch.addField('firstname');
													oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness);
													oSearch.addFilter('firstname', 'EQUAL_TO', $('#ns1blankspaceDetailsFirstName').val());
													oSearch.addFilter('surname', 'EQUAL_TO', $('#ns1blankspaceDetailsLastName').val());

													oSearch.getResults(function(data) {ns1blankspace.financial.payroll["new"].save(oParam, data)});
												}
											}
											else	
											{
												if (oResponse.data.rows.length > 0)
												{
													ns1blankspace.financial.payroll["new"].process(
													{
														contactPerson: oResponse.data.rows[0].id,
														contactBusiness: iContactBusiness
													});		
												}
												else
												{
													var sData = 'contactbusiness=' + ns1blankspace.util.fs(iContactBusiness);
													sData += '&firstname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFirstName').val());
													sData += '&surname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLastName').val());

													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
														data: sData,
														dataType: 'json',
														success: function(data)
														{
															if (data.status == 'OK')
															{
																ns1blankspace.status.message('Employee added.')

																ns1blankspace.financial.payroll["new"].process(
																{
																	contactPerson: data.id,
																	contactBusiness: iContactBusiness
																});	
															}
															else
															{
																ns1blankspace.status.error('Could not add employee.')
															}
														}
													});
												}	
											}
										}
										else
										{
											//save employee.
										}	
									}
								},

					process: function (oParam)
								{
									var iContactBusiness = ns1blankspace.user.contactBusiness;
									var iContactPerson;
									var iID;
									var sData;

									if (oParam != undefined)
									{
										if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
										if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
									}		

									sData = 'id=' + ns1blankspace.util.fs(iID);
									sData += '&contactbusiness=' + ns1blankspace.util.fs(iContactBusiness);
									sData += '&contactperson=' + ns1blankspace.util.fs(iContactPerson);
									sData += '&status=2';
									sData += '&pretaxsupertype=1';
									sData += '&superannuationrate=9.5';
									sData += '&employmentstartdate=' + Date.today().toString("dd MMM yyyy");
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('Saved.');
											ns1blankspace.show({selector: '#ns1blankspaceMainEmployee'});
											ns1blankspace.financial.payroll.employees.show({filterEmployee: data.id});
										}	
									});		
								}
				},				

	employees: 	
				{
					show: 	function (oParam, oResponse)
								{
									var iStep = 1;
									var iStepAction = 1;
									var iEmployee;
									var iFilterEmployee;
									var iID = '';
									var sXHTMLElementID;
									var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;
									var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;

									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step};
										if (oParam.stepAction != undefined) {iStepAction = oParam.stepAction};
										if (oParam.employee != undefined) {iEmployee = oParam.employee};
										if (oParam.id != undefined) {iID = oParam.id};
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.filterEmployee != undefined) {iFilterEmployee = oParam.filterEmployee};
									}
									else
									{
										oParam = {step: 1};
									}
									
									if (sXHTMLElementID != undefined)
									{
										var aXHTMLElementID = sXHTMLElementID.split('-');
									}
										
									//EMPLOYEES LIST
									if (iStep == 1)	
									{
										ns1blankspace.financial.payroll.data.context = 'employees';

										var aHTML = [];
										var sSearchClass = '';
										var sSearchValue = '';

										if (sSearchText == '')
										{
											sSearchValue = 'search'
											sSearchClass = ' ns1blankspaceWatermark'
										}

										aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspacePayrollEmployeeColumn1Container" class="ns1blankspaceColumn1" style="width:125px;padding-right:10px;">' +
													'<div style="font-size:0.875em;">' +
													'<input id="ns1blankspacePayrollEmployeeColumn1Search" class="ns1blankspaceText' + sSearchClass + '" value="' + sSearchValue + '">' +
													'</div>' +
													'<div id="ns1blankspacePayrollEmployeeColumn1" style="font-size:0.875em;"></div>' +
													'<div id="ns1blankspacePayrollEmployeeColumn1ShowAllContainer"></div>' +
													'</td>' +
													'<td id="ns1blankspacePayrollEmployeeColumn2" class="ns1blankspaceColumn2">' + 
													'<table class="ns1blankspaceColumn2">' +
													'<tr><td class="ns1blankspaceSubNote" id="ns1blankspacePayrollEmployeeColumn2Count" style="font-weight:600;">' +
													'</td></tr>' +
													'<tr><td class="ns1blankspaceSubNote">' +
													'Click New to add an employee or select an employee to update their details.' +
													'</td></tr>' +
													'</table>' +	
													'</td>' +
													'</tr>' + 
													'</table>');		
															
										$('#ns1blankspaceMainEmployee').html(aHTML.join(''));

										if (sSearchText != '')
										{
											$('#ns1blankspacePayrollEmployeeColumn1Search').focus().val(sSearchText);;
										}

										$('#ns1blankspacePayrollEmployeeColumn1').html(ns1blankspace.xhtml.loading);
										
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('contactpersontext,employmentstartdate,employmentenddate,statustext,employeenumber,employee.contactperson.firstname,employee.contactperson.surname,employee.taxfilenumber');
											
											if (!bShowAll)
											{	
												oSearch.addFilter('status', 'EQUAL_TO', '2')
											}

											if (sSearchText != '')
											{	
												oSearch.addBracket('(');
												oSearch.addFilter('employee.contactperson.firstname', 'TEXT_IS_LIKE', sSearchText)
												oSearch.addOperator('or');
												oSearch.addFilter('employee.contactperson.surname', 'TEXT_IS_LIKE', sSearchText)
												oSearch.addOperator('or');
												oSearch.addFilter('employeenumber', 'TEXT_IS_LIKE', sSearchText)
												oSearch.addBracket(')');
											}		

											if (iFilterEmployee !== undefined)
											{
												oSearch.addFilter('id', 'EQUAL_TO', iFilterEmployee);
											}	

											oSearch.rows = 100;
											oSearch.sort('employeenumber', 'asc');
											oSearch.sort('employee.contactperson.firstname', 'asc');
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											$('#ns1blankspacePayrollEmployeeColumn1Search').keyup(function()
											{
												oParam = ns1blankspace.util.setParam(oParam, 'searchText', $(this).val());
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
												ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.payroll.employees.show(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
											});

											$('#ns1blankspacePayrollEmployeeColumn1ShowAllContainer').html(
												'<div class="ns1blankspaceSubNote" style="margin-top:12px; cursor:pointer;"' +
												' id="ns1blankspacePayrollEmployeeColumn1ShowAll">Show ' +
												(bShowAll?'only active':'all employees') +
												'</div>');

											if (bShowAll)
											{
												$('#ns1blankspacePayrollEmployeeColumn2Count').html('')
											}
											else
											{
												$('#ns1blankspacePayrollEmployeeColumn2Count').html(oResponse.data.rows.length + ' active employees.')
											}
											
											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table><tr>' + 
														'<td class="ns1blankspaceNothing">There are no active employees.</td>' + 
														'</tr>' +
														'</table>');
											}
											else
											{
												aHTML.push('<table id="ns1blankspacePayrollEmployees" cellpadding=6>');
												
												var oRows = oResponse.data.rows;
											
												$(oRows).each(function() 
												{
													aHTML.push(ns1blankspace.financial.payroll.employees.row(this));
												});
											
												aHTML.push('</table>');
											}
										
											ns1blankspace.render.page.show(
											{
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollEmployeeColumn1',
												xhtmlContext: 'PayrollEmployees',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 100,
												functionShowRow: ns1blankspace.financial.payroll.employees.row,
												functionOpen: undefined,
												functionNewPage: ''
										   }); 
											
											$('.employee').click(function()
											{
												$('#ns1blankspacePayrollEmployees td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#' + this.id).addClass('ns1blankspaceRowShadedHighlight');

												var aID = (this.id).split('-');
												$.extend(true, oParam, {step: 2, employee: parseInt(aID[1])});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});

											if (iFilterEmployee !== undefined)
											{
												$('#ns1blankspacePayrollEmployees td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#ns1blankspaceEmployee_contact-' + iFilterEmployee).addClass('ns1blankspaceRowShadedHighlight');
												$.extend(true, oParam, {step: 2, employee: iFilterEmployee});
												ns1blankspace.financial.payroll.employees.show(oParam);
											}

											$('#ns1blankspacePayrollEmployeeColumn1ShowAll').click(function()
											{
												oParam.showAll = !bShowAll;
												oParam.step = 1;
												delete oParam.filterEmployee;
												ns1blankspace.financial.payroll.employees.show(oParam);
											});
										}
									}
									
									//EMPLOYEE DETAILS
									if (iStep == 2)
									{
										if (oResponse == undefined)
										{
											$('#ns1blankspacePayrollEmployeeColumn2').html(ns1blankspace.xhtml.loadingSmall);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
											oSearch.addField('area,areatext,contactbusiness,contactbusinesstext,contactperson,contactpersontext,employeenumber,employmentenddate,employmentstartdate,' +
																'notes,project,projecttext,status,statustext,allowance,allowancedescription,allowanceincludeinsuper,' +
																'allowancetaxable,deducthelp,deduction,deductiondescription,endtime,financialsupplementdebt,' +
																'foreignresident,highestlevel,highestleveltext,leaveloadingrate,medicare,medicaretext,' +
																'payfrequency,payfrequencytext,rebates,specialtaxrate,standardhours,starttime,' +
																'taxadjustment,taxadjustmentdescription,taxfilenumber,taxfilenumberdeclaration,' +
																'taxfreethreshold,contact1,contact1phone,contact2,contact2phone,emergencynotes,posttaxsuperamount,' +
																'posttaxsupercontactbusiness,posttaxsupercontactbusinesstext,posttaxsuperfundname,posttaxsupermembernumber,' +
																'posttaxsupertype,posttaxsupertypetext,pretaxsuperamount,pretaxsupercontactbusiness,pretaxsupercontactbusinesstext,' +
																'pretaxsuperfundname,pretaxsupermembernumber,pretaxsupertype,pretaxsupertypetext,' +
																'supercontactbusiness,supercontactbusinesstext,superannuationrate,superfundname,supermembernumber,' +
																'annualleaveentitlement,longserviceentitlement,sickleaveentitlement,' +
																'internalrelationships,jobdetails,kpi,responsibilities,tasks,copyreceived,expirydate,' +
																'inductionprogram,medicalreport,medicalreportdate,programdate,registrationnumber,workerscompform,workhoursform,' +
																'employee.contactperson.firstname,employee.contactperson.surname,employee.contactperson.email,employee.contactperson.dateofbirth,' +
																'superguaranteeapplyhighincomecap,' +
																'employee.contactperson.streetaddress1,employee.contactperson.streetaddress2,employee.contactperson.streetsuburb,' +
																'employee.contactperson.streetstate,employee.contactperson.streetpostcode,employee.contactperson.streetcountry,' +
																'terminationtype,taxtreatmentcode,incometypecode');

											oSearch.addFilter('id', 'EQUAL_TO', iEmployee);
											oSearch.getResults(function(data) {ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											ns1blankspace.financial.employee = oResponse.data.rows[0];
										
											var aHTML = [];
										
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePayrollEmployeeDetailsColumn1" class="ns1blankspaceColumn1" style="width:50px;font-size:0.875em;padding-right:10px;">' +
															ns1blankspace.xhtml.loading + '</td>' +
															'<td id="ns1blankspacePayrollEmployeeDetailsColumn2" class="ns1blankspaceColumn2">' +
															'</td>' +
															'</tr>' + 
															'</table>');		
			
											$('#ns1blankspacePayrollEmployeeColumn2').html(aHTML.join(''));
											
											var aHTML = [];

											aHTML.push('<table id="ns1blankspacePayrollEmployeeDetails" class="ns1blankspaceColumn2" cellpadding=6>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-11" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Details</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-12" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Payroll</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-13" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Standard Pay</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-14" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Bank&nbsp;Accounts</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-15" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Superannuation</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-19" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Standard Leave</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-16" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Role</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-17" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Induction</td></tr>');


											aHTML.push('<tr><td class="ns1blankspaceSub" style="padding-top:14px; padding-bottom:0xp;">' +
																	'ACTUALS</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-20" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Pays</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-21" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Pay Items</td></tr>');

											aHTML.push('<tr><td id="ns1blankspaceFinancialEmployee_details-22" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetails">' +
																	'Leave</td></tr>');

											aHTML.push('</table>');

											$('#ns1blankspacePayrollEmployeeDetailsColumn1').html(aHTML.join(''));
										
											$('.ns1blankspacePayrollEmployeeDetails').click(function()
											{
												$('#ns1blankspacePayrollEmployeeDetails td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
												$('#' + this.id).addClass('ns1blankspaceRowShadedHighlight');

												var aID = (this.id).split('-');
												$.extend(true, oParam, {step: parseInt(aID[1]), stepAction: 1});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});

											$('#ns1blankspaceFinancialEmployee_details-11').addClass('ns1blankspaceRowShadedHighlight');
											$.extend(true, oParam, {step: 11});
											ns1blankspace.financial.payroll.employees.show(oParam);
										}
									}
									
									if (iStep == 11)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails11Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails11Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Employee Number' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmployeeNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Status' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Proposed' +
														'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Active' +
														'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>In-active' +
														'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Full Time' +
														'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>Part Time' +
														'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Casual' +
														'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>Labour Hire' +
														'<br /><input type="radio" id="radioStatus8" name="radioStatus" value="8"/>Volunteer' +
														'<br /><input type="radio" id="radioStatus9" name="radioStatus" value="9"/>Death Beneficiary' +
														'<br /><input type="radio" id="radioStatus10" name="radioStatus" value="10"/>Terminated' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Start Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'End Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Termination Type' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTerminationType1" name="radioTerminationType" value="1"/>Not Terminated' +
														'<br /><input type="radio" id="radioTerminationType2" name="radioTerminationType" value="2"/>Ill Health' +
														'<br /><input type="radio" id="radioTerminationType3" name="radioTerminationType" value="3"/>Deceased' +
														'<br /><input type="radio" id="radioTerminationType4" name="radioTerminationType" value="4"/>Redundancy' +
														'<br /><input type="radio" id="radioTerminationType5" name="radioTerminationType" value="5"/>Dismissal' +
														'<br /><input type="radio" id="radioTerminationType6" name="radioTerminationType" value="6"/>Contract Ended' +
														'<br /><input type="radio" id="radioTerminationType7" name="radioTerminationType" value="7"/>Transfer' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'First name' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFirstName" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Surname' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSurname" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Email' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Mobile (Phone)' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsMobile" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Date of Birth' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsDateOfBirth" class="ns1blankspaceDate">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Street Address 1' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetAddress1" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Street Address 2' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetAddress2" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Suburb' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetSuburb" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'State' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetState" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Post Code' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetPostCode" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Country' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsStreetCountry" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Notes' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceMultiSmall">' +
														'<textarea rows="20" cols="35" id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMulti" style="width:97%;"></textarea>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails11Column1').html(aHTML.join(''));

										ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsFirstName').val(ns1blankspace.financial.employee["employee.contactperson.firstname"]);
											$('#ns1blankspaceDetailsSurname').val(ns1blankspace.financial.employee["employee.contactperson.surname"]);
											$('#ns1blankspaceDetailsEmail').val(ns1blankspace.financial.employee["employee.contactperson.email"]);
											$('#ns1blankspaceDetailsMobile').val(ns1blankspace.financial.employee["employee.contactperson.mobile"]);
											$('#ns1blankspaceDetailsDateOfBirth').val(ns1blankspace.financial.employee["employee.contactperson.dateofbirth"]);
											$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["status"] + '"]').attr('checked', true);
											$('[name="radioTerminationType"][value="' + ns1blankspace.financial.employee["terminationtype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsNotes').val(ns1blankspace.financial.employee["notes"]);
											$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.financial.employee["employmentstartdate"]);
											$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.financial.employee["employmentenddate"]);
											$('#ns1blankspaceDetailsEmployeeNumber').val(ns1blankspace.financial.employee["employeenumber"]);
											$('#ns1blankspaceDetailsStreetAddress1').val(ns1blankspace.financial.employee["employee.contactperson.streetaddress1"]);
											$('#ns1blankspaceDetailsStreetAddress2').val(ns1blankspace.financial.employee["employee.contactperson.streetaddress2"]);
											$('#ns1blankspaceDetailsStreetSuburb').val(ns1blankspace.financial.employee["employee.contactperson.streetsuburb"]);
											$('#ns1blankspaceDetailsStreetState').val(ns1blankspace.financial.employee["employee.contactperson.streetstate"]);
											$('#ns1blankspaceDetailsStreetPostCode').val(ns1blankspace.financial.employee["employee.contactperson.streetpostcode"]);
											$('#ns1blankspaceDetailsStreetCountry').val(ns1blankspace.financial.employee["employee.contactperson.streetcountry"]);
										}
										else
										{
											$('[name="radioStatus"][value="1"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails11Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											if ($('input[name="radioStatus"]:checked').val() == 1 && ns1blankspace.financial.employee["status"] != 1) //proposed
											{
												$('[name="radioStatus"][value="' + ns1blankspace.financial.employee["status"] + '"]').prop('checked', true);
												ns1blankspace.status.error('You can not set status back to Proposed once it has been set to Active or Inactive.')
											}

											var oData =
											{
												id: iEmployee,
												status: $('input[name="radioStatus"]:checked').val(),
												terminationtype: $('input[name="radioTerminationType"]:checked').val(),
												employmentstartdate: $('#ns1blankspaceDetailsStartDate').val(),
												employmentenddate: $('#ns1blankspaceDetailsEndDate').val(),
												employeenumber: $('#ns1blankspaceDetailsEmployeeNumber').val(),
												notes: $('#ns1blankspaceDetailsNotes').val()
											}	

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: oData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{				
														var oData =
														{
															id: ns1blankspace.financial.employee.contactperson,
															firstname: $('#ns1blankspaceDetailsFirstName').val(),
															surname: $('#ns1blankspaceDetailsSurname').val(),
															email: $('#ns1blankspaceDetailsEmail').val(),
															mobile: $('#ns1blankspaceDetailsMobile').val(),
															dateofbirth: $('#ns1blankspaceDetailsDateOfBirth').val(),
															streetaddress1: $('#ns1blankspaceDetailsStreetAddress1').val(),
															streetaddress2: $('#ns1blankspaceDetailsStreetAddress2').val(),
															streetsuburb: $('#ns1blankspaceDetailsStreetSuburb').val(),
															streetstate: $('#ns1blankspaceDetailsStreetState').val(),
															streetpostcode: $('#ns1blankspaceDetailsStreetPostCode').val(),
															streetcountry: $('#ns1blankspaceDetailsStreetCountry').val()
														}	

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
															data: oData,
															dataType: 'json',
															success: function(data)
															{
																if (data.status == 'OK')
																{
																	ns1blankspace.status.message('Saved');
																	oParam.step = 2;
																	ns1blankspace.financial.payroll.employees.show(oParam);
																}
																else
																{
																	ns1blankspace.status.error(data.error.errornotes);
																}
															}
														});
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}
									
									if (iStep == 12)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails12Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails12Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Frequency' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioFrequency1" name="radioFrequency" value="1"/>Weekly' +
														'<br /><input type="radio" id="radioFrequency2" name="radioFrequency" value="2"/>Fortnightly' +
														'<br /><input type="radio" id="radioFrequency3" name="radioFrequency" value="3"/>Monthly' +
														'<br /><input type="radio" id="radioFrequency4" name="radioFrequency" value="4"/>Bi/Semi Monthly' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Medicare' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioMedicare1" name="radioMedicare" value="1"/>Pay Medicare' +
														'<br /><input type="radio" id="radioMedicare2" name="radioMedicare" value="2"/>Full Exemption' +
														'<br /><input type="radio" id="radioMedicare3" name="radioMedicare" value="3"/>Half Exemption' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax File Number<br /><span class="ns1blankspaceSubNote">If left blank, tax will be calculated at the highest rate.</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxNumber" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax File Number Declaration Completed' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxFileNumberDeclarationY" name="radioTaxFileNumberDeclaration" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioTaxFileNumberDeclarationN" name="radioTaxFileNumberDeclaration" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax Threshold' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxFreeThresholdY" name="radioTaxFreeThreshold" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioTaxFreeThresholdN" name="radioTaxFreeThreshold" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Foreign Resident' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioForeignResidentY" name="radioForeignResident" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioForeignResidentN" name="radioForeignResident" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Income Type Code' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsIncomeTypeCode" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Tax Treatment Code' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxTreatmentCode" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Leaving Loading Rate' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsLeaveLoadingRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Rebates Amount ($)' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsRebatesAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Special Tax Rate (%)' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSpecialTaxRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'STANDARD ALLOWANCES' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAllowanceAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAllowanceDescription" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Include In Superannuation Contribution Calculation' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAllowanceIncludeInSuperY" name="radioAllowanceIncludeInSuper" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioAllowanceIncludeInSuperN" name="radioAllowanceIncludeInSuper" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Taxable' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioAllowanceTaxableY" name="radioAllowanceTaxable" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioAllowanceTaxableN" name="radioAllowanceTaxable" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'STANDARD DEDUCATIONS' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeductionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsDeductionDescription" class="ns1blankspaceText">' +
														'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Deduction for HELP<br /><span class="ns1blankspaceSubNote">Higher Education Loan Program</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioDeductHELPY" name="radioDeductHELP" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioDeductHELPN" name="radioDeductHELP" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'STANDARD TAX ADJUSTMENTS' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount ($)<br /><span class="ns1blankspaceSubNote">Per Pay</span>' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxAdjustmentAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +	
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsTaxAdjustmentDescription" class="ns1blankspaceText">' +
														'</td></tr>');	

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails12Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('[name="radioFrequency"][value="' + ns1blankspace.financial.employee["payfrequency"] + '"]').attr('checked', true);
											$('[name="radioMedicare"][value="' + ns1blankspace.financial.employee["medicare"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsTaxNumber').val(ns1blankspace.financial.employee["taxfilenumber"]);
											$('[name="radioTaxFileNumberDeclaration"][value="' + ns1blankspace.financial.employee["taxfilenumberdeclaration"] + '"]').attr('checked', true);
											$('[name="radioTaxFreeThreshold"][value="' + ns1blankspace.financial.employee["taxfreethreshold"] + '"]').attr('checked', true);
											$('[name="radioForeignResident"][value="' + ns1blankspace.financial.employee["foreignresident"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsLeaveLoadingRate').val(ns1blankspace.financial.employee["leaveloadingrate"]);
											$('#ns1blankspaceDetailsRebatesAmount').val(ns1blankspace.financial.employee["rebates"]);
											$('#ns1blankspaceDetailsSpecialTaxRate').val(ns1blankspace.financial.employee["specialtaxrate"]);

											$('#ns1blankspaceDetailsAllowanceAmount').val(ns1blankspace.financial.employee["allowance"]);
											$('#ns1blankspaceDetailsAllowanceDescription').val(ns1blankspace.financial.employee["allowancedescription"]);
											$('[name="radioAllowanceIncludeInSuper"][value="' + ns1blankspace.financial.employee["allowanceincludeinsuper"] + '"]').attr('checked', true);
											$('[name="radioAllowanceTaxable"][value="' + ns1blankspace.financial.employee["allowancetaxable"] + '"]').attr('checked', true);

											$('#ns1blankspaceDetailsDeductionAmount').val(ns1blankspace.financial.employee["deduction"]);
											$('#ns1blankspaceDetailsDeductionDescription').val(ns1blankspace.financial.employee["deductiondescription"]);
											$('[name="radioDeductHELP"][value="' + ns1blankspace.financial.employee["deducthelp"] + '"]').attr('checked', true);
											
											$('#ns1blankspaceDetailsTaxAdjustmentAmount').val(ns1blankspace.financial.employee["taxadjustment"]);
											$('#ns1blankspaceDetailsTaxAdjustmentDescription').val(ns1blankspace.financial.employee["taxadjustmentdescription"]);

											$('#ns1blankspaceDetailsTaxTreatmentCode').val(ns1blankspace.financial.employee["taxtreatmentcode"]);
											$('#ns1blankspaceDetailsIncomeTypeCode').val(ns1blankspace.financial.employee["incometypecode"]);
										}
										else
										{
											$('[name="radioFrequency"][value="1"]').attr('checked', true);
											$('[name="radioMedicare"][value="1"]').attr('checked', true);
											$('[name="radioTaxFileNumberDeclaration"][value="N"]').attr('checked', true);
											$('[name="radioTaxFreeThreshold"][value="N"]').attr('checked', true);
											$('[name="radioForeignResident"][value="N"]').attr('checked', true);
											$('[name="radioAllowanceIncludeInSuper"][value="N"]').attr('checked', true);
											$('[name="radioAllowanceTaxable"][value="N"]').attr('checked', true);
											$('[name="radioDeductHELP"][value="N"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails12Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);
											sData += '&payfrequency=' + ns1blankspace.util.fs($('input[name="radioFrequency"]:checked').val());
											sData += '&medicare=' + ns1blankspace.util.fs($('input[name="radioMedicare"]:checked').val());
											sData += '&taxfilenumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxNumber').val());
											sData += '&taxfilenumberdeclaration=' + ns1blankspace.util.fs($('input[name="radioTaxFileNumberDeclaration"]:checked').val());
											sData += '&taxfreethreshold=' + ns1blankspace.util.fs($('input[name="radioTaxFreeThreshold"]:checked').val());
											sData += '&foreignresident=' + ns1blankspace.util.fs($('input[name="radioForeignResident"]:checked').val());
											sData += '&leaveloadingrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLeaveLoadingRate').val());
											sData += '&rebates=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsRebatesAmount').val());
											sData += '&specialtaxrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSpecialTaxRate').val());

											sData += '&allowance=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowanceAmount').val());
											sData += '&allowancedescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAllowanceDescription').val());
											sData += '&allowanceincludeinsuper=' + ns1blankspace.util.fs($('input[name="radioAllowanceIncludeInSuper"]:checked').val());
											sData += '&allowancetaxable=' + ns1blankspace.util.fs($('input[name="radioAllowanceTaxable"]:checked').val());

											sData += '&deduction=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeductionAmount').val());
											sData += '&deductiondescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDeductionDescription').val());
											sData += '&deducthelp=' + ns1blankspace.util.fs($('input[name="radioDeductHELP"]:checked').val());

											sData += '&taxadjustment=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxAdjustmentAmount').val());
											sData += '&taxadjustmentdescription=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxAdjustmentDescription').val());

											sData += '&taxtreatmentcode=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTaxTreatmentCode').val());
											sData += '&incometypecode=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsIncomeTypeCode').val());

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Saved');
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam)
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}

									//SUPERANNUATION
									if (iStep == 15)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetails15Column1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetails15Column2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption">' +
														'EMPLOYER CONTRIBUTION' +
														'</td></tr>')

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');
								
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollSuperannuationBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Superannuation %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsEmployerSuperannuationRate" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Apply High Income Cap' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioSuperGuaranteeApplyHighIncomeCapY" name="radioSuperGuaranteeApplyHighIncomeCap" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioSuperGuaranteeApplyHighIncomeCapN" name="radioSuperGuaranteeApplyHighIncomeCap" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'SALARY SACRIFICE CONTRIBUTION' +
														'</td></tr>')

										//'<input type="radio" id="radioPreTaxSuperContributionType" name="radioPreTaxSuperContributionType" value=""/><i>Not Set</i><br />' +

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPreTaxSuperContributionType1" name="radioPreTaxSuperContributionType" value="1"/>$ amount per pay' +
														'<br /><input type="radio" id="radioPreTaxSuperContributionType2" name="radioPreTaxSuperContributionType" value="2"/>Percentage of pay' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'$ Amount or %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperContributionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPreTaxSuperFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollPreTaxSuperContributionBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'EMPLOYEE VOLUNTARY CONTRIBUTION' +
														'</td></tr>');

										//'<input type="radio" id="radioPostTaxSuperContributionType" name="radioPostTaxSuperContributionType" value=""/><i>Not Set</i><br />' +

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioPostTaxSuperContributionType1" name="radioPostTaxSuperContributionType" value="1"/>$ amount per pay' +
														'<br /><input type="radio" id="radioPostTaxSuperContributionType2" name="radioPostTaxSuperContributionType" value="2"/>Percentage of pay' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'$ Amount or %' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperContributionAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Name' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperFundName" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Member Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsPostTaxSuperFundMemberNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Fund Manager<br /><span class="ns1blankspaceSubNote">A business contact used when creating the superannuation expenses. The default fund will be used if no alternate employee choice of fund.</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceSelect">' +
														'<input id="ns1blankspacePayrollPostTaxSuperContributionBusiness" class="ns1blankspaceSelect"' +
															' data-method="CONTACT_BUSINESS_SEARCH"' +
															' data-columns="tradename">' +
														'</td></tr>');																	

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails15Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsFundName').val(ns1blankspace.financial.employee["superfundname"]);
											$('#ns1blankspaceDetailsFundMemberNumber').val(ns1blankspace.financial.employee["supermembernumber"]);
											$('#ns1blankspaceDetailsEmployerSuperannuationRate').val(ns1blankspace.financial.employee["superannuationrate"]);	
											$('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id', ns1blankspace.financial.employee["supercontactbusiness"]);
											$('#ns1blankspacePayrollSuperannuationBusiness').val(ns1blankspace.financial.employee["supercontactbusinesstext"]);
											$('[name="radioSuperGuaranteeApplyHighIncomeCap"][value="' + ns1blankspace.financial.employee["superguaranteeapplyhighincomecap"] + '"]').attr('checked', true);

											$('[name="radioPreTaxSuperContributionType"][value="' + ns1blankspace.financial.employee["pretaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsPreTaxSuperContributionAmount').val(ns1blankspace.financial.employee["pretaxsuperamount"]);
											$('#ns1blankspacePayrollPreTaxSuperContributionBusiness').attr('data-id', ns1blankspace.financial.employee["pretaxsupercontactbusiness"]);
											$('#ns1blankspacePayrollPreTaxSuperContributionBusiness').val(ns1blankspace.financial.employee["pretaxsupercontactbusinesstext"]);
											$('#ns1blankspaceDetailsPreTaxSuperFundName').val(ns1blankspace.financial.employee["pretaxsuperfundname"]);
											$('#ns1blankspaceDetailsPreTaxSuperFundMemberNumber').val(ns1blankspace.financial.employee["pretaxsupermembernumber"]);
											
											$('[name="radioPostTaxSuperContributionType"][value="' + ns1blankspace.financial.employee["posttaxsupertype"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsPostTaxSuperContributionAmount').val(ns1blankspace.financial.employee["posttaxsuperamount"]);
											$('#ns1blankspacePayrollPostTaxSuperContributionBusiness').attr('data-id', ns1blankspace.financial.employee["posttaxsupercontactbusiness"]);
											$('#ns1blankspacePayrollPostTaxSuperContributionBusiness').val(ns1blankspace.financial.employee["posttaxsupercontactbusinesstext"]);
											$('#ns1blankspaceDetailsPostTaxSuperFundName').val(ns1blankspace.financial.employee["posttaxsuperfundname"]);
											$('#ns1blankspaceDetailsPostTaxSuperFundMemberNumber').val(ns1blankspace.financial.employee["posttaxsupermembernumber"]);
										}
										else
										{
											$('[name="radioSuperContributionType"][value="1"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails15Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);
											
											sData += '&superfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundName').val());
											sData += '&supermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsFundMemberNumber').val());
											sData += '&superannuationrate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmployerSuperannuationRate').val());
											sData += '&supercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollSuperannuationBusiness').attr('data-id'));
											sData += '&superguaranteeapplyhighincomecap=' + ns1blankspace.util.fs($('input[name="radioSuperGuaranteeApplyHighIncomeCap"]:checked').val());
											
											sData += '&pretaxsuperfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperFundName').val());
											sData += '&pretaxsupermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperFundMemberNumber').val());
											sData += '&pretaxsupertype=' + ns1blankspace.util.fs($('input[name="radioPreTaxSuperContributionType"]:checked').val());
											sData += '&pretaxsuperamount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPreTaxSuperContributionAmount').val());
											sData += '&pretaxsupercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollPreTaxSuperContributionBusiness').attr('data-id'));

											sData += '&posttaxsuperfundname=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperFundName').val());
											sData += '&posttaxsupermembernumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperFundMemberNumber').val());
											sData += '&posttaxsupertype=' + ns1blankspace.util.fs($('input[name="radioPostTaxSuperContributionType"]:checked').val());
											sData += '&posttaxsuperamount=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPostTaxSuperContributionAmount').val());
											sData += '&posttaxsupercontactbusiness=' + ns1blankspace.util.fs($('#ns1blankspacePayrollPostTaxSuperContributionBusiness').attr('data-id'));

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Superannuation saved');
														oParam.step = 2
														ns1blankspace.financial.payroll.employees.show(oParam);
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}

									//LEAVE
									if (iStep == 19)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails19Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails19Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Annual Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsAnnualLeaveEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Long Service Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsLongServiceEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Sick Leave<br /><span class="ns1blankspaceSubNote">Hours Per Pay</span>' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsSickLeaveEntitlement" class="ns1blankspaceText">' +
														'</td></tr>');
															
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails19Column1').html(aHTML.join(''));

										ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsAnnualLeaveEntitlement').val(ns1blankspace.financial.employee["annualleaveentitlement"]);
											$('#ns1blankspaceDetailsLongServiceEntitlement').val(ns1blankspace.financial.employee["longserviceentitlement"]);
											$('#ns1blankspaceDetailsSickLeaveEntitlement').val(ns1blankspace.financial.employee["sickleaveentitlement"]);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails19Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&annualleaveentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsAnnualLeaveEntitlement').val());
											sData += '&longserviceentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsLongServiceEntitlement').val());
											sData += '&sickleaveentitlement=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSickLeaveEntitlement').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Leave saved');
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}	

									//ROLE
									if (iStep == 16)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails16Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails16Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsJobDescription" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');
										
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Reports To' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsInternalRelationships" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'KPIs' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsKPI" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Responsibilities' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsResponsibilities" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');


										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Must Do Tasks' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<textarea rows="10" cols="35" id="ns1blankspaceDetailsTasks" class="ns1blankspaceTextMultiSmall"></textarea>' +
														'</td></tr>');

										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails16Column1').html(aHTML.join(''));

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsJobDescription').val(ns1blankspace.financial.employee["jobdetails"]);
											$('#ns1blankspaceDetailsInternalRelationships').val(ns1blankspace.financial.employee["internalrelationships"]);
											$('#ns1blankspaceDetailsKPI').val(ns1blankspace.financial.employee["kpi"]);
											$('#ns1blankspaceDetailsResponsibilities').val(ns1blankspace.financial.employee["responsibilities"]);
											$('#ns1blankspaceDetailsTasks').val(ns1blankspace.financial.employee["tasks"]);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails16Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&jobdetails=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsJobDescription').val());
											sData += '&internalrelationships=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsInternalRelationships').val());
											sData += '&kpi=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsKPI').val());
											sData += '&responsibilities=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsResponsibilities').val());
											sData += '&tasks=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTasks').val());
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Role saved');
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}	

									//INDUCTION
									if (iStep == 17)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetails17Column1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetails17Column2" style="width:75px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');	

										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Induction Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspace">' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceDetailsInductionDate" class="ns1blankspaceDate">' +
														'</td></tr>');
											
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Workers Compensation Insurance Completed' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioWorkersCompensationY" name="radioWorkersCompensation" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkersCompensationN" name="radioWorkersCompensation" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Work Contract Completed' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioWorkHoursContractY" name="radioWorkHoursContract" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioWorkHoursContractN" name="radioWorkHoursContract" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Medical Report Received' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioMedicalReportY" name="radioMedicalReport" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioMedicalReportN" name="radioMedicalReport" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr>' +
														'<td class="ns1blankspaceHeaderCaption" style="padding-top:14px;">' +
														'WORKING WITH CHILDREN (SUITABILITY) CHECK' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Certificate / Copy of Suitability Card Received' +
														'</td></tr>' +
														'<tr><td class=""ns1blankspaceText">' +
														'<input type="radio" id="radioSuitabilityCopyReceivedY" name="radioSuitabilityCopyReceived" value="Y"/>Yes' +
														'<br /><input type="radio" id="radioSuitabilityCopyReceivedN" name="radioSuitabilityCopyReceived" value="N"/>No' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Registration Number' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceDetailsRegistrationNumber" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Expiry Date' +
														'</td></tr>' +
														'<tr><td class="ns1blankspaceDate">' +
														'<input id="ns1blankspaceSuitabilityDate" class="ns1blankspaceDate">' +
														'</td></tr>');

															
										aHTML.push('</table>');					
											
										$('#ns1blankspacePayrollEmployeeDetails17Column1').html(aHTML.join(''));

										ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

										if (ns1blankspace.financial.employee != undefined)
										{
											$('#ns1blankspaceDetailsInductionDate').val(ns1blankspace.financial.employee["programdate"]);
											$('[name="radioWorkersCompensation"][value="' + ns1blankspace.financial.employee["workerscompform"] + '"]').attr('checked', true);
											$('[name="radioWorkHoursContract"][value="' + ns1blankspace.financial.employee["workhoursform"] + '"]').attr('checked', true);
											$('[name="radioMedicalReport"][value="' + ns1blankspace.financial.employee["medicalreport"] + '"]').attr('checked', true);
											$('[name="radioSuitabilityCopyReceived"][value="' + ns1blankspace.financial.employee["copyreceived"] + '"]').attr('checked', true);
											$('#ns1blankspaceDetailsRegistrationNumber').val(ns1blankspace.financial.employee["registrationnumber"]);
											$('#ns1blankspaceSuitabilityDate').val(ns1blankspace.financial.employee["expirydate"]);
										}
										else
										{
											$('[name="radioWorkersCompensation"][value="N"]').attr('checked', true);
											$('[name="radioWorkHoursContract"][value="N"]').attr('checked', true);
											$('[name="radioMedicalReport"][value="N"]').attr('checked', true);
											$('[name="radioSuitabilityCopyReceived"][value="N"]').attr('checked', true);
										}

										var aHTML = [];
						
										aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>' +
														'<span id="ns1blankspacePayrollEmployee_options_save" class="ns1blankspaceAction">' +
														'Save</span></td></tr></table>');					
										
										$('#ns1blankspacePayrollEmployeeDetails17Column2').html(aHTML.join(''));

										$('#ns1blankspacePayrollEmployee_options_save').button(
										{
											text: "Save"
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sData = 'id=' + ns1blankspace.util.fs(iEmployee);							
											sData += '&workerscompform=' + ns1blankspace.util.fs($('input[name="radioWorkersCompensation"]:checked').val());	
											sData += '&programdate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsInductionDate').val());
											sData += '&workhoursform=' + ns1blankspace.util.fs($('input[name="radioWorkHoursContract"]:checked').val());
											sData += '&medicalreport=' + ns1blankspace.util.fs($('input[name="radioMedicalReport"]:checked').val());		
											sData += '&copyreceived=' + ns1blankspace.util.fs($('input[name="radioSuitabilityCopyReceived"]:checked').val());	
											sData += '&registrationnumber=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsRegistrationNumber').val());
											sData += '&expirydate=' + ns1blankspace.util.fs($('#ns1blankspaceSuitabilityDate').val());
									
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														ns1blankspace.status.message('Induction saved');
														oParam.step = 2;
														ns1blankspace.financial.payroll.employees.show(oParam);
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});	

										})
										.css('font-size', '0.75em');
									}	

									if (iStep == 18)
									{
										var sSearch = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;
										var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;

										var aData = $.grep(ns1blankspace.financial.payroll.data.linetypes, function (type)
										{ 
											var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: type.id});
											var bInclude = ($.grep(aIncludeIn, function (include) {return !include.selectable}).length == 0)

											if (bInclude && sSearch != '' && !bAll) {bInclude = ((type.title).toLowerCase().indexOf(sSearch.toLowerCase()) != -1)}

											return bInclude
										});
										
										$vq.clear({queue: 'type'});

										if (aData.length == 0)
										{
											$vq.add('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceSubNote">No pay types.</td></tr>' + 
															'</table>', {queue: 'type'});

											$vq.render('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults', {queue: 'type'});		
										}
										else
										{	
											$vq.add('<table class="ns1blankspace">', {queue: 'type'});
											
											$.each(aData, function(d, data) 
											{ 
												$vq.add('<tr class="ns1blankspaceRow">'+ 
																'<td id="ns1blankspaceTypeem_title-' + data.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
																data.title + '</td></tr>', {queue: 'type'});	
											});
											
											$vq.add('</table>');

											$vq.render('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults', {queue: 'type'});
											
											$('.ns1blankspaceRowSelect')
											.click(function()
											{
												var sID = this.id;
												var aID = sID.split('-');

												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', aID[1]);
												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val($(this).html());
												$('#ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults').html('');

												ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: aID[1]});
											});
										}
									}

									//PAYS
									if (iStep == 20)
									{
										if (oResponse == undefined)
										{
											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePayrollEmployeeDetailsPaysColumn1" style="font-size:0.875em;">' +
															ns1blankspace.xhtml.loading + '</td>' +
															'<td id="ns1blankspacePayrollEmployeeDetailsPaysColumn2" style="width:0px;">' +
															'</td>' +
															'</tr>' + 
															'</table>');				
											
											$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
											oSearch.addField('payrecord.payperiod.paydate,payrecord.payperiod.id,grosssalary,netsalary,superannuation,taxafterrebate,taxbeforerebate,taxadjustments' +
																',deductions,allowances' +
																',supercalculationmonthallowances' +
															 	',supercalculationmonthexclusion' +
															 	',supercalculationmonthinitialgrosssalary' +
															 	',supercalculationmonthinitialsuperannuation' +
															 	',supercalculationmonthleaveloading' +
															 	',supercalculationmonthsalarysacrificesuper' +
															 	',supercalculationmonthposthighincomecap' +
															 	',supercalculationmonthpreviouscalculation' +
															 	',supercalculationrate');

											oSearch.rows = 9999;

											if (iStepAction == 1)
											{	
												oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
												oSearch.rows = 50;
												oSearch.sort('payrecord.payperiod.paydate', 'desc');
											}
											else if (iStepAction == 2)
											{
												oSearch.addFilter('id', 'EQUAL_TO', aXHTMLElementID[1]);
												oParam.id = aXHTMLElementID[1];
											}	

											oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											var aHTML = [];

											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceColumn2"><tr><td><div class="ns1blankspaceNothing">No pays.</div></td></tr></table>');
											}
											else
											{	

												aHTML.push('<table class="ns1blankspaceColumn2">');
												aHTML.push('<tr class="ns1blankspaceCaption">');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Pay Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Gross</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Allowances</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Deductions</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Net</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Superannuation</td>');

												//aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:30px;text-align:right;"><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction"></span></td>');
												aHTML.push('</tr>');

												$(oResponse.data.rows).each(function() 
												{
													aHTML.push('<tr class="ns1blankspaceRow">');
																	
													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_paydate-' + this['payrecord.payperiod.id'] + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetailsPays">' +
																	this['payrecord.payperiod.paydate'] + '</td>');
									
													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_grosssalary-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this.grosssalary + '</td>');

													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_allowances-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this.allowances + '</td>');

													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_deductions-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this.deductions + '</td>');

													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_netsalary-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this.netsalary + '</td>');

													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_superannuation-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																	this.superannuation + '</td>');

													//aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
													//				'<span id="ns1blankspacePayrollEmployeeDetailsPayRate_options_remove-' + this.id + '" class="ns1blankspacePayrollEmployeeDetailsPayRateRemove"></span></td>');
								
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');
											}

											$('#ns1blankspacePayrollEmployeeDetailsPaysColumn1').html(aHTML.join(''));

											$('.ns1blankspacePayrollEmployeeDetailsPays').click(function()
											{
												$.extend(true, oParam, {showPay: true, xhtmlElementID: this.id});
												ns1blankspace.financial.payroll.init(oParam);
											});
										}
									}

									//PAY ITEMS
									if (iStep == 21)
									{
										if (oResponse == undefined)
										{
											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePayrollEmployeeDetailsPayItemsColumn1" style="font-size:0.875em;">' +
															ns1blankspace.xhtml.loading + '</td>' +
															'<td id="ns1blankspacePayrollEmployeeDetailsPayItemsColumn2" style="width:40px; padding-left:18px;">' +
															'</td>' +
															'</tr>' + 
															'</table>');				
											
											$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
											oSearch.addField('payrecorditem.payrecord.payperiod.paydate,payrecorditem.payrecord.employeetext,type,typetext,hours,rate,total,includeinsuper,manuallyupdated,notes,standardline,standardlinetext,taxable');
											oSearch.addFilter('payrecorditem.payrecord.employee', 'EQUAL_TO', iEmployee);
											oSearch.sort('payrecorditem.payrecord.payperiod.paydate', 'desc')
											oSearch.sort('typetext', 'asc');
											oSearch.rows = 9999;
											oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
										}
										else
										{
											var aHTML = [];

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<table class="ns1blankspaceColumn2"><tr><td><div class="ns1blankspaceNothing">No pay items.</div></td></tr></table>');
											}
											else
											{	
												aHTML.push('<table class="ns1blankspaceColumn2">');
												aHTML.push('<tr class="ns1blankspaceCaption">');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Pay Date</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
												aHTML.push('</tr>');

												$(oResponse.data.rows).each(function(i, item) 
												{
													aHTML.push('<tr class="ns1blankspaceRow">');

													aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPays_paydate-' + this['payrecord.payperiod.id'] + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPays">' +
																	this['payrecorditem.payrecord.payperiod.paydate'] + '</td>');
											
													aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_type-' + this.id + '" class="ns1blankspaceRow">' +
																			this.typetext + '</td>');

													var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: item.type});
													var oIncludeIn = $.grep(aIncludeIn, function (i) {return !i.dependant})[0];

													var bHours = (oIncludeIn!==undefined?$.grep(aIncludeIn, function (i) {return !i.dependant})[0].hours:false);
													var cAmount = numeral((bHours?item.hours:item.rate)).value();
													
													if (bHours)
													{
														aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																			numeral(cAmount).format('(0,0.00)') + 
																			'<br /><span class="ns1blankspaceSubNote">' + (bHours?'hours&nbsp;@&nbsp;' + ns1blankspace.option.currencySymbol + 
																			numeral(item.rate).format('(0,0.00)'):ns1blankspace.option.currencySymbol) + '</span>' +
																			'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol +
																			numeral(item.total).format('(0,0.00)') + '</span></td>');
													}
													else
													{
														aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																			numeral(cAmount).format('(0,0.00)') +
																			'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol + 
																				numeral(item.total).format('(0,0.00)') + '</span> ' + 
																			'</td>');					 			
													}						
																																
													aHTML.push('</tr>');
												});
												
												aHTML.push('</table>');
											}	
							
											$('#ns1blankspacePayrollEmployeeDetailsPayItemsColumn1').html(aHTML.join(''));

											$('#ns1blankspacePayrollEmployeeDetailsPayItemsColumn2').html(
													'<table class="ns1blankspaceColumn2"><tr><td>' +
													'<span class="ns1blankspaceAction" id="ns1blankspacePayItemsExport"></span></td></tr></table>');

											$('#ns1blankspacePayItemsExport').button(
											{
												label: 'Export'
											})
											.click(function()
											{
												var oFormat =
												[{
													options:
													{
														delimiter: ',',
														surroundWith: '"'
													},

													header:
													[
														{
															line: 1,
															fields:
															[
																{value: 'Pay Date'},
																{value: 'Type'},
																{value: 'Hours'},
																{value: 'Rate'},
																{value: 'Total'},
																{value: 'Included In Superannuation Calculation'},
																{value: 'Taxable'},
																{value: 'Notes'}
															]
														}	
													],


													item:
													[
														{
															fields:
															[
																{field: 'payrecorditem.payrecord.payperiod.paydate'},
																{field: 'typetext'},
																{field: 'hours'},
																{field: 'rate'},
																{field: 'total'},
																{field: 'includeinsuper'},
																{field: 'taxable'},
																{field: 'notes'}
															]
														}		
													]
												}]

												var sFileName = 'payroll-employee-pay-items.csv'

												ns1blankspace.setup.file.export.process(
											   {
											   	items: oResponse.data.rows,
													format: oFormat,
													saveToFile: true,
													open: true,
													fileName: sFileName
												});
											});
										}
									}

									//ACTUAL LEAVE
									if (iStep == 22)
									{
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeDetailsActualLeaveColumn1" style="font-size:0.875em;">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeDetailsActualLeaveColumn2" style="width:40px; padding-left:18px;">' +
														'</td>' +
														'</tr>' + 
														'</table>');				
										
										$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));

										var aHTML = [];

										if (iStepAction == 3)
										{
											aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccountEdit" class="ns1blankspaceColumn2" style="padding-right:15px;">');

                                            aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Pay Run' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceText">' +
															'<input id="ns1blankspacePayrollEmployeeDetailsActualLeavePayRecord" class="ns1blankspaceSelect"' +
                                                            ' data-method="FINANCIAL_PAYROLL_PAY_RECORD_SEARCH" data-columns="payrecord.payperiod.paydate"' +
                                                            ' data-methodFilter="employee-EQUAL_TO-' + iEmployee + '"' +
                                                            ' data-methodsortcolumn="payrecord.payperiod.paydate"' +
                                                            ' data-methodsortdirection="desc"' +
                                                            ' data-id="">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Type' +
															'</td></tr>' +
															'<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioType1" name="radioType" value="1"/>Annual' +
															'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Sick' +
															'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Long Service' +
															'</td></tr>');		

											aHTML.push('<tr><td class="ns1blankspaceCaption">Hours</td></tr>' +
															'<tr><td>' +
															'<input id="ns1blankspacePayrollEmployeeDetailsActualLeaveHours" class="ns1blankspaceText">' +
															'</td></tr>');

											aHTML.push('<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceCaption">' +
															'Notes' +
															'</td></tr>' +
															'<tr><td class="ns1blankspaceMultiSmall">' +
															'<textarea rows="5" cols="35" id="ns1blankspacePayrollEmployeeDetailsActualLeaveNotes" class="ns1blankspaceTextMulti" style="width:100%; height:120px;"></textarea>' +
															'</td></tr>');

											aHTML.push('</table>');

											$('#ns1blankspacePayrollEmployeeDetailsActualLeaveColumn1').html(aHTML.join(''));

											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsActualLeave_options_save" class="ns1blankspaceAction">Save</span>' +
															'</td></tr>' +
															'<tr><td>' +
															'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsActualLeave_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
															'</td></tr>' +
															'</table>');	

											$('#ns1blankspacePayrollEmployeeDetailsActualLeaveColumn2').html(aHTML.join(''));

											$('#ns1blankspacePayrollEmployeeDetailsActualLeave_options_save').button(
											{
												text: "Save"
											})
											.click(function() 
											{
												ns1blankspace.status.working();

												var oData = 
												{
													employee: iEmployee,
													hours: $('#ns1blankspacePayrollEmployeeDetailsActualLeaveHours').val(),
													type: $('input[name="radioType"]:checked').val(),
													notes: $('#ns1blankspacePayrollEmployeeDetailsActualLeaveNotes').val(),
                                                    record: $('#ns1blankspacePayrollEmployeeDetailsActualLeavePayRecord').attr('data-id')
												}

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function(data)
													{
														if (data.status == "OK")
														{
															ns1blankspace.status.message('Saved');
															$.extend(true, oParam, {stepAction: 1, id: ''});
															ns1blankspace.financial.payroll.employees.show(oParam);
														}
														else
														{
															ns1blankspace.status.error(data.error.errornotes);
														}
													}
												});
											});

											$('#ns1blankspacePayrollEmployeeDetailsActualLeave_options_cancel').button(
											{
												text: "Cancel"
											})
											.click(function() 
											{
												$.extend(true, oParam, {stepAction: 1});
												ns1blankspace.financial.payroll.employees.show(oParam);
											});
										}
										else
										{
											if (oResponse == undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_SEARCH';
												oSearch.addField('payemployeeleave.period.paydate,typetext,hours,itemtext,notes,createddate');
												oSearch.addFilter('employee', 'EQUAL_TO', iEmployee);
												oSearch.addSummaryField('sum(hours) hours');
												oSearch.sort('createddate', 'desc')
												oSearch.sort('typetext', 'asc');
												oSearch.rows = 9999;
												oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
											}
											else
											{
												var aHTML = [];

												if (oResponse.data.rows.length == 0)
												{
													aHTML.push('<table class="ns1blankspaceColumn2"><tr><td><div class="ns1blankspaceNothing">No employee leave.</div></td></tr></table>');
												}
												else
												{	
													aHTML.push('<div><table class="ns1blankspaceColumn2">');
													aHTML.push('<tr class="ns1blankspaceCaption">');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Hours</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Pay Date</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption"></td>');
													aHTML.push('</tr>');

													$(oResponse.data.rows).each(function(i, item) 
													{
														aHTML.push('<tr class="ns1blankspaceRow">');

														aHTML.push('<td id="ns1blankspaceFinancialPayLeave_type-' + this.id + '" class="ns1blankspaceRow">' +
																				this.typetext + '</td>');

														aHTML.push('<td id="ns1blankspaceFinancialPayLeave_hours-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
																				this.hours + '</td>');

														aHTML.push('<td id="ns1blankspaceFinancialPayLeave_paydate-' + this['id'] + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsActualLeave">' +
																		this['payemployeeleave.period.paydate'] + '</td>');

														aHTML.push('<td class="ns1blankspaceRow" style="text-align:right;">' +
																				'<span id="ns1blankspaceFinancialPayLeave_remove-' + this.id + '" class="ns1blankspaceItemRemove"></span></td>');
																							
														aHTML.push('</tr>');
													});
													
													aHTML.push('</table></div>');
												}	
								
												$('#ns1blankspacePayrollEmployeeDetailsActualLeaveColumn1').html(aHTML.join(''));

												$('.ns1blankspaceItemRemove:visible').button(
												{
													text: false,
													icons:
													{
														primary: "ui-icon-close"
													}
												})
												.click(function()
												{
													$.extend(true, oParam,
													{
														stepAction: 1, xhtmlElementID: this.id, id: undefined, confirmed: false,
														method: 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_MANAGE',
														ifNoneMessage: '<table class="ns1blankspaceColumn2"><tr><td><div class="ns1blankspaceNothing">No employee leave.</div></td></tr></table>',
														onComplete: ns1blankspace.financial.payroll.employees.show
													});

													delete oParam.id;

													ns1blankspace.remove(oParam);
												})
												.css('width', '15px')
												.css('height', '17px');

												var aHTML = [];

												aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>');
												aHTML.push('<div class="ns1blankspaceSubNote">Total Leave (hours)</div>')
												aHTML.push('<div class="ns1blankspaceSub" style="padding-top:0px; font-size: 1.2em; padding-bottom:16px;">' +
																	numeral(numeral(oResponse.summary.hours).value()).format('0,0.00') + '</div>')
												aHTML.push('<div style="margin-bottom:10px;"><span style="width:70px;" class="ns1blankspaceAction" id="ns1blankspaceActualLeaveAdd"></span></div>');
												aHTML.push('<div><span style="width:70px;" class="ns1blankspaceAction" id="ns1blankspaceActualLeaveExport"></span></div>');
												aHTML.push('</td></tr></table>')
					
												$('#ns1blankspacePayrollEmployeeDetailsActualLeaveColumn2').html(aHTML.join(''));

												$('#ns1blankspaceActualLeaveAdd').button(
												{
													label: "Add"
												})
												.click(function()
												{
													$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
													ns1blankspace.financial.payroll.employees.show(oParam);
												})
												.css('font-size', '0.75em');

												$('#ns1blankspaceActualLeaveExport').button(
												{
													label: 'Export'
												})
												.click(function()
												{
													var oFormat =
													[{
														options:
														{
															delimiter: ',',
															surroundWith: '"'
														},

														header:
														[
															{
																line: 1,
																fields:
																[
																	{value: 'Type'},
																	{value: 'Hours'},
																	{value: 'Pay Date'},
																	{value: 'Notes'},
																	{value: 'Created Date'}
																]
															}	
														],

														item:
														[
															{
																fields:
																[
																	{field: 'typetext'},
																	{field: 'hours'},
																	{field: 'payemployeeleave.period.paydate'},
																	{field: 'notes'},
																	{field: 'createddate'}
																]
															}		
														]
													}]

													var sFileName = 'payroll-employee-leave.csv'

													ns1blankspace.setup.file.export.process(
												   	{
												   		items: oResponse.data.rows,
														format: oFormat,
														saveToFile: true,
														open: true,
														fileName: sFileName
													});
												});
											}
										}	
									}

									//STANDARD PAY
									if (iStep == 13)
									{
										if (iStepAction == 4)
										{
											if (confirm('Click OK to delete this standard pay.'))
											{	
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE'),
													data: 'remove=1&id=' + aXHTMLElementID[1],
													dataType: 'json',
													success: function(data)
													{
														if (data.status == 'OK')
														{
															$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
															$.extend(true, oParam, {stepAction: 1});
															ns1blankspace.financial.payroll.employees.show(oParam);
															ns1blankspace.status.message('Removed');
														}
														else
														{
															ns1blankspace.status.error(data.error.errornotes);
														}
													}
												});
											}	
										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_SEARCH';		
												oSearch.addField('employmenttype,employmenttypetext,enddate,notes,rate,startdate,linetype,linetypetext,units');

												if (iStepAction == 1)
												{	
													oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
													oSearch.rows = 50;
													oSearch.sort('startdate', 'desc');
												}
												else
												{
													oSearch.addFilter('id', 'EQUAL_TO', aXHTMLElementID[1]);
													oParam.id = aXHTMLElementID[1];
												}	

												oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
											}
											else
											{
												var aHTML = [];

												aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetailsPayRateColumn1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetailsPayRateColumn2" style="width:0px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');				
											
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
												var sAmount;

												if (iStepAction == 1)
												{
													var aHTML = [];

													if (oResponse.data.rows.length == 0)
													{
														aHTML.push('<table class="ns1blankspaceColumn2">' +
																		'<tr><td><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">' +
																			'</span></td></tr>' + 
																		'</table>');

														$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));
													}
													else
													{	
														aHTML.push('<table class="ns1blankspaceColumn2">');
														aHTML.push('<tr class="ns1blankspaceCaption">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Start Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">End Date</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:left;">Type</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:left; width:100px;">' +
															ns1blankspace.financial.employee["payfrequencytext"] +	
															' Amount</td>');

														//ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
																
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:30px;text-align:right;"><span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction"></span></td>');
														aHTML.push('</tr>');

														$(oResponse.data.rows).each(function() 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
																			
															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_startdate-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.startdate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_enddate-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate">' +
																			this.enddate + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_type-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate" style="text-align:left;">' +
																			this.linetypetext + '</td>');

															//var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: this.linetypetext});

															var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: this.linetype});
															var oIncludeIn = $.grep(aIncludeIn, function (i) {return !i.dependant})[0];

															var bHours = (oIncludeIn!==undefined?$.grep(aIncludeIn, function (i) {return !i.dependant})[0].hours:false);
											
															if (bHours)
															{	
																sAmount = this.units + ' hours @ ' + ns1blankspace.option.currencySymbol + this.rate + '/hour';
															}
															else
															{
																sAmount = ns1blankspace.option.currencySymbol + this.rate;
															}	

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsPayRate_amount-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsPayRate" style="text-align:left;">' +
																			sAmount + '</td>');

															aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
																			'<span id="ns1blankspacePayrollEmployeeDetailsPayRate_options_remove-' + this.id + '" class="ns1blankspacePayrollEmployeeDetailsPayRateRemove"></span></td>');
										
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													}
													
													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployee_options_add').button(
													{
														text: false,
														icons:
														{
															primary: "ui-icon-plus"
														}
													})
													.click(function()
													{
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '23px')
													.css('height', '22px');

													$('.ns1blankspacePayrollEmployeeDetailsPayRateRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function()
													{
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('.ns1blankspacePayrollEmployeeDetailsPayRate').click(function()
													{
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID:this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
												}
												else
												{
													aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:15px;">');
										
													aHTML.push('<tr><td class="ns1blankspaceCaption">Start Date</td></tr>' +
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateStartDate" class="ns1blankspaceDate">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">End Date</td></tr>' +
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateEndDate" class="ns1blankspaceDate">' +
																	'</td></tr>');

													var aNotSelectable = $.map($.grep(ns1blankspace.financial.payroll.data.linetypes, function (type) {return !type.selectable}), function (type) {return type.id});

													aHTML.push('<tr class="ns1blankspaceCaption">' +
																	'<td class="ns1blankspaceCaption">' +
																	'Type' +
																	'</td></tr>' +
																	'<tr>' +
																	'<td class="ns1blankspaceSelect">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateLineType" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspacePayrollEmployeeDetailsPayRateLineTypeSearchResults">' +
																		'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all pay types<br />or just start typing.</span></td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
																	ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
																	' Hours</td></tr>' +
																	'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateUnits" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
																	ns1blankspace.option.currencySymbol +
																	'/Hour</td></tr>' +
																	'<tr><td class="ns1blankspaceCaption includein includeinhoursN">' +
																	ns1blankspace.option.currencySymbol +
																	'</td></tr>' +
																	'<tr><td class="ns1blankspaceText">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAmount" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').keyup(function(e)
													{
														$.extend(true, oParam, {step: 18, searchText: $(this).val(), all: (e.which === 13)});
														ns1blankspace.financial.payroll.employees.show(oParam)
													});

													var aHTML = [];
												
													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');

													aHTML.push('<table class="ns1blankspaceColumn2 includein includeinhoursY" style="font-size:0.75em; background-color:#F3F3F3; margin-top:25px; border:0px; padding-left:5px;">' +
																	'<tr><td class="ns1blankspaceCaption" style="padding-top:8px;">' +
																	'Calculate<br />hourly rate..' +
																	'</td></tr>' +
																	'<tr><td class="ns1blankspaceSub" style="padding-top:8px;">' +
																	'Annual Wage' +
																	'</td></tr>' +
																	'<tr><td style="padding-right:13px;">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount" class="ns1blankspaceText">' +
																	'</td></tr>' +
																	'<tr><td class="ns1blankspaceSub" style="padding-top:5px;">' +
																	'Hours per week' +
																	'</td></tr>' +
																	'<tr><td style="padding-right:13px;">' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek" class="ns1blankspaceText">' +
																	'</td></tr>' +
																	'</table>');			

													$('#ns1blankspacePayrollEmployeeDetailsPayRateColumn2').html(aHTML.join(''));

													ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

													$('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val(Date.today().toString("dd MMM yyyy"));

													$('.includein').hide();

													var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: 'Normal'});

													if (oLineType != undefined)
													{	
														$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oLineType.id);
														$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oLineType.title);
														$('.includeinhoursY').show();
													}	

													$('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount, #ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').keyup(function ()
													{
														var cAnnual = $('#ns1blankspacePayrollEmployeeDetailsPayRateAnnualAmount').val();
														var cHoursWeek = $('#ns1blankspacePayrollEmployeeDetailsPayRateHoursPerWeek').val();

														if (cHoursWeek == '') {cHoursWeek = 0}

														if (cHoursWeek != 0)
														{
															$('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val(cHoursWeek);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val(ns1blankspace.util.toFixed(cAnnual / (52 * cHoursWeek)));
														}	
													});

													$('#ns1blankspacePayrollEmployeeDetailsPayRate_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspace.status.working();

														var oData = {id: iID, units: 1};
														if (iID == '')
														{
															oData.employee = iEmployee;
														}	
														oData.startdate = $('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val();
														oData.enddate = $('#ns1blankspacePayrollEmployeeDetailsPayRateEndDate').val();
														oData.linetype = $('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id');

														oData.rate = $('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val();
													
														if ($('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').is(':visible'))
														{	
															oData.units = $('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val();
															if (oData.units == '') {oData.units = 0}
														}

														if (oData.rate == '') {oData.rate = 0}

														if (oData.linetype == '' || oData.startdate == '')
														{
															ns1blankspace.status.error('Start Date or Type missing')
														}
														else
														{
															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_MANAGE'),
																data: oData,
																dataType: 'json',
																success: function(data) {
																	if (data.status == "OK")
																	{
																		ns1blankspace.status.message('Saved');
																		$.extend(true, oParam, {step: 13});
																		$.extend(true, oParam, {stepAction: 1, id: ''});
																		ns1blankspace.financial.payroll.employees.show(oParam);
																	}
																	else
																	{
																		ns1blankspace.status.error(data.error.errornotes);
																	}
																}
															});
														}	
													});

													$('#ns1blankspacePayrollEmployeeDetailsPayRate_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#ns1blankspacePayrollEmployeeDetailsPayRateStartDate').val(oObjectContext.startdate);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateEndDate').val(oObjectContext.enddate);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateAmount').val(oObjectContext.rate);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oObjectContext.linetype);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oObjectContext.linetypetext);
															$('#ns1blankspacePayrollEmployeeDetailsPayRateUnits').val(oObjectContext.units);

															ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oObjectContext.linetype});
														}
														else
														{
															var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({title: 'Normal'});

															if (oLineType != undefined)
															{	
																$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').attr('data-id', oLineType.id);
																$('#ns1blankspacePayrollEmployeeDetailsPayRateLineType').val(oLineType.title);

																ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oLineType.id});
															}	
														}
													}	
												}
											}
										}			
									}
									
									//BANK ACCOUNTS
									if (iStep == 14)
									{
										if (iStepAction == 4)
										{	
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE'),
												data: 'remove=1&id=' + aXHTMLElementID[1],
												dataType: 'json',
												success: function(data)
												{
													if (data.status == 'OK')
													{
														$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
														ns1blankspace.status.message('Removed');
													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}
												}
											});

										}
										else
										{
											if ((iStepAction == 1 || iStepAction == 2) && (oResponse == undefined))
											{
												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(ns1blankspace.xhtml.loadingSmall);

												var oSearch = new AdvancedSearch();
												oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_SEARCH';		
												
												if (iStepAction == 1)
												{	
													oSearch.addField('accountname,accountnumber,bsb,percentage');
													oSearch.addFilter('employee', 'EQUAL_TO', iEmployee)
													oSearch.rows = 50;
													oSearch.sort('accountname', 'asc');
												}
												else
												{
													oSearch.addField('accountname,accountnumber,bsb,percentage');
													oSearch.addFilter('id', 'EQUAL_TO', aXHTMLElementID[1])
													oParam.id = aXHTMLElementID[1];
												}	

												oSearch.getResults(function(data){ns1blankspace.financial.payroll.employees.show(oParam, data)});
											}
											else
											{
												var aHTML = [];

												aHTML.push('<table class="ns1blankspaceContainer">' +
																'<tr class="ns1blankspaceContainer">' +
																'<td id="ns1blankspacePayrollEmployeeDetailsBankAccountColumn1" style="font-size:0.875em;">' +
																ns1blankspace.xhtml.loading + '</td>' +
																'<td id="ns1blankspacePayrollEmployeeDetailsBankAccountColumn2" style="width:75px;">' +
																'</td>' +
																'</tr>' + 
																'</table>');	

												$('#ns1blankspacePayrollEmployeeDetailsColumn2').html(aHTML.join(''));
											
												var aHTML = [];
											
												if (iStepAction == 1)
												{
													var aHTML = [];
						
													aHTML.push('<table class="ns1blankspaceColumn2">' +
																	'<tr><td >' +
																	'<span id="ns1blankspacePayrollEmployee_options_add" class="ns1blankspaceAction">Add</span>' +
																	'</td></tr>' +
																	'</table>');					
													
													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployee_options_add').button(
													{
														text: "Add"
													})
													.click(function()
													{
														$.extend(true, oParam, {stepAction: 3, xhtmlElementID: "", id: ""});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('font-size', '0.75em');
												
													var aHTML = [];

													if (oResponse.data.rows.length == 0)
													{
														aHTML.push('<table class="ns1blankspaceColumn2">' +
																		'<tr><td class="ns1blankspaceNothing">No bank accounts.</td></tr>' +
																		'</table>');

														$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));
													}
													else
													{	
														aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccount" class="ns1blankspaceColumn2">');
														aHTML.push('<tr class="ns1blankspaceCaption">');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Name</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">BSB</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">Number</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">% of Pay</td>');
														aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
														aHTML.push('</tr>');

														$(oResponse.data.rows).each(function() 
														{
															aHTML.push('<tr class="ns1blankspaceRow">');
																			
															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_name-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount">' +
																			this.accountname + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_bsb-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount">' +
																			this.bsb + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_number-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount" style="text-align:right;">' +
																			this.accountnumber + '</td>');

															aHTML.push('<td id="ns1blankspacePayrollEmployeeDetailsBankAccount_percentage-' + this.id + '" class="ns1blankspaceRow ns1blankspacePayrollEmployeeDetailsBankAccount" style="text-align:right;">' +
																			this.percentage + '</td>');

															aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
																			'<span id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_remove-' + this.id + '" class="ns1blankspaceRemove"></span></td>');
										
															aHTML.push('</tr>');
														});
														
														aHTML.push('</table>');
													}
													
													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount .ns1blankspaceRemove').button(
													{
														text: false,
														icons: {
															primary: "ui-icon-close"
														}
													})
													.click(function() {
														$.extend(true, oParam, {stepAction: 4, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
													.css('width', '15px')
													.css('height', '17px');

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount td.ns1blankspaceRow').click(function() {
														$.extend(true, oParam, {stepAction: 2, xhtmlElementID: this.id});
														ns1blankspace.financial.payroll.employees.show(oParam);
													})
												}
												else
												{
													aHTML.push('<table id="ns1blankspacePayrollEmployeeDetailsBankAccountEdit" class="ns1blankspaceColumn2" style="padding-right:15px;">');
										
													aHTML.push('<tr><td class="ns1blankspaceCaption">Account Name</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountName" class="ns1blankspaceText">' +
																	'</td></tr>');

													aHTML.push('<tr><td class="ns1blankspaceCaption">BSB</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountBSB" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">Account Number</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountNumber" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('<tr><td class="ns1blankspaceCaption">% of Wage</td></tr>' +
																	'<tr><td>' +
																	'<input id="ns1blankspacePayrollEmployeeDetailsBankAccountPercentage" class="ns1blankspaceText">' +
																	'</td></tr>');	

													aHTML.push('</table>');

													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn1').html(aHTML.join(''));

													var aHTML = [];

													aHTML.push('<table class="ns1blankspaceColumn2" style="font-size:0.875em">' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_save" class="ns1blankspaceAction">Save</span>' +
																	'</td></tr>' +
																	'<tr><td>' +
																	'<span style="width:70px;" id="ns1blankspacePayrollEmployeeDetailsBankAccount_options_cancel" class="ns1blankspaceAction">Cancel</span>' +
																	'</td></tr>' +
																	'</table>');	

													$('#ns1blankspacePayrollEmployeeDetailsBankAccountColumn2').html(aHTML.join(''));

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount_options_save').button(
													{
														text: "Save"
													})
													.click(function() 
													{
														ns1blankspace.status.working();

														var sData = 'id=' + ns1blankspace.util.fs(iID);
														if (iID == '')
														{
															sData += '&employee=' + ns1blankspace.util.fs(iEmployee);
														}	
														sData += '&accountname=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountName').val());
														sData += '&bsb=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountBSB').val());
														sData += '&accountnumber=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountNumber').val());
														sData += '&percentage=' + ns1blankspace.util.fs($('#ns1blankspacePayrollEmployeeDetailsBankAccountPercentage').val());

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data) {
																if (data.status == "OK")
																{
																	ns1blankspace.status.message('Saved');
																	$.extend(true, oParam, {stepAction: 1, id: ''});
																	ns1blankspace.financial.payroll.employees.show(oParam);
																}
																else
																{
																	ns1blankspace.status.error(data.error.errornotes);
																}
															}
														});
													});

													$('#ns1blankspacePayrollEmployeeDetailsBankAccount_options_cancel').button(
													{
														text: "Cancel"
													})
													.click(function() 
													{
														$.extend(true, oParam, {stepAction: 1});
														ns1blankspace.financial.payroll.employees.show(oParam);
													});
													
													if (oResponse != undefined)
													{	
														if (oResponse.data.rows.length != 0)
														{
															var oObjectContext = oResponse.data.rows[0];
															
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountName').val(oObjectContext.accountname);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountBSB').val(oObjectContext.bsb);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountNumber').val(oObjectContext.accountnumber);
															$('#ns1blankspacePayrollEmployeeDetailsBankAccountPercentage').val(oObjectContext.percentage);
														}
														else
														{
														}
													}	

												}
											}
										}			
									}
								},

					row:		function (oRow)
								{
									var aHTML = [];
								
									if (oRow.contactpersontext != '')
									{
										aHTML.push('<tr class="ns1blankspaceRow">');
												
										aHTML.push('<td id="ns1blankspaceEmployee_contact-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect employee">' +
																oRow["employee.contactperson.firstname"] + ' ' + oRow["employee.contactperson.surname"]);

										if (oRow["employeenumber"] != '' || oRow["statustext"] != '')
										{
											aHTML.push('<br />');

											if (oRow["employeenumber"] != '')
											{
												aHTML.push('<span class="ns1blankspaceSub">' + oRow["employeenumber"]);
											}

											if (oRow["statustext"] != '')
											{
												if (oRow["employeenumber"] != '')
												{
													aHTML.push(', ')
												}

												aHTML.push('<span class="ns1blankspaceSub">' + oRow["statustext"]);
											}
										}	

										aHTML.push('</td></tr>');
									}

									return aHTML.join('');
								}
				},				

	pays: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var iEmployee;
					var iPay;
					var sEmployeeText;

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step};
						if (oParam.employee != undefined) {iEmployee = oParam.employee};
						if (oParam.pay != undefined) {iPay = oParam.pay};
						if (oParam.employeeText != undefined) {sEmployeeText = oParam.employeeText};
					}
					else
					{
						oParam = {};
					}	

					//PAY RECORDS
					if (iStep == 1)
					{
						ns1blankspace.financial.payroll.data.context = 'pays';

						var aHTML = [];
						
						if (oResponse == undefined)
						{
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspacePayrollPayColumn1" class="ns1blankspaceColumn1" style="width:180px;padding-right:5px;font-size:0.875em;"></td>' +
											'<td id="ns1blankspacePayrollPayColumn2" class="ns1blankspaceColumn2"></td>' +
											'</tr>' + 
											'</table>');	
							
							$('#ns1blankspaceMainPays').html(aHTML.join(''));
						
							$('#ns1blankspacePayrollPayColumn1').html(ns1blankspace.xhtml.loading);

							if (ns1blankspace.objectContextData.status == "1")
							{
								var aHTML = [];
								
								aHTML.push('<table class="ns1blankspaceColumn2">' +
												'<tr><td class="ns1blankspaceAction">' +
												'<span id="ns1blankspaceFinancialPayrollPayAdd">Add</span>' +
												'</td></tr>' +
												'</table>');					
								
								$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));
							
								$('#ns1blankspaceFinancialPayrollPayAdd').button(
								{
									label: "Add"
								})
								.click(function()
								{
									$.extend(true, oParam, {step: 11, xhtmlElementID: ''});
									ns1blankspace.financial.payroll.pays(oParam);
								})
							}

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addField('payrecord.employee.contactperson,payrecord.employee.employeenumber,payrecord.employee.contactperson.firstname,' + 
												'payrecord.employee.contactperson.surname,payrecord.employee.taxfilenumber' +
												',grosssalary,netsalary,superannuation,taxafterrebate,taxbeforerebate,taxadjustments' +
												',supercalculationmonthallowances' +
											 	',supercalculationmonthexclusion' +
											 	',supercalculationmonthinitialgrosssalary' +
											 	',supercalculationmonthinitialsuperannuation' +
											 	',supercalculationmonthleaveloading' +
											 	',supercalculationmonthsalarysacrificesuper' +
											 	',supercalculationmonthposthighincomecap' +
											 	',supercalculationmonthpreviouscalculation' +
											 	',supercalculationrate');

							oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
							oSearch.rows = 200;
							oSearch.sort('payrecord.employee.employeenumber', 'asc');
							oSearch.sort('payrecord.employee.contactperson.firstname', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<table><tr>' + 
												'<td class="ns1blankspaceNothing">No pay runs.</td>' + 
												'</tr></table>');
							}
							else
							{
								aHTML.push('<table id="ns1blankspacePayrollRuns" cellpadding=6>');

								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
									
									aHTML.push('<td id="ns1blankspacePayrollPay_name-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect"' +
															' data-employeeText="' + this["payrecord.employee.contactperson.firstname"] +
															' ' + this["payrecord.employee.contactperson.surname"] + '">' +
															this["payrecord.employee.contactperson.firstname"] + 
															' ' + this["payrecord.employee.contactperson.surname"]);

									if (this["payrecord.employee.employeenumber"] != '...' && this["payrecord.employee.employeenumber"] != '')
									{
										aHTML.push(' (<span class="_ns1blankspaceSub">' + this["payrecord.employee.employeenumber"] + '</span>)');
									}

									if (true)
									{
										aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.5em; margin-top:4px;">GROSS SALARY</div>' +
												'<div id="ns1blankspacePayrollPay_grosssalary-' + this.id + '" class="ns1blankspaceSub" style="margin-top:-2px;">' + this["grosssalary"] + '</div>');

										aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.5em; margin-top:4px;">TAX</div>' +
												'<div id="ns1blankspacePayrollPay_tax-' + this.id + '" class="ns1blankspaceSub" style="margin-top:-2px;">' + this["taxbeforerebate"] + '</div>');

										aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.5em; margin-top:4px;">TAX ADJUSTMENTS</div>' +
												'<div id="ns1blankspacePayrollPay_tax-' + this.id + '" class="ns1blankspaceSub" style="margin-top:-2px;">' + this["taxadjustments"] + '</div>');

										aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.5em; margin-top:4px;">NET SALARY</div>' +
												'<div id="ns1blankspacePayrollPay_netsalary-' + this.id + '" class="ns1blankspaceSub" style="margin-top:-2px;">' + this["netsalary"] + '</div>');

										//aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.5em; margin-top:4px;">SUPERANNUATION</div>' +
										//		'<div id="ns1blankspacePayrollPay_superannuation-' + this.id + '" class="ns1blankspaceSub" style="margin-top:-2px;">' + this["superannuation"] + '</div>');
									}

									if (this["payrecord.employee.taxfilenumber"] == '')
									{
										aHTML.push('<div class="ns1blankspaceSub" style="font-size:0.7em; margin-top:4px;">No tax file number, so taxed at highest rate.</div>');
									}

									aHTML.push('</td>');
													
									if (ns1blankspace.objectContextData.status == "1")
									{					
										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspacePayrollPay_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
													'</td>');
									}								
																												
									aHTML.push('</tr>');
								});
							
								aHTML.push('</table>');
							}
						
							$('#ns1blankspacePayrollPayColumn1').html(aHTML.join(''));
						
							$('#ns1blankspacePayrollRuns .ns1blankspaceRowRemove').button(
							{
								text: false,
							 	icons: {primary: "ui-icon-close"}
							})
							.click(function()
							{
								var aXHTMLElementID = (this.id).split('-');
								$.extend(true, oParam, {step: 12, pay: aXHTMLElementID[1]});
								ns1blankspace.financial.payroll.pays(oParam)
							})
							.css('width', '15px')
							.css('height', '20px')
						
							$('#ns1blankspacePayrollRuns td.ns1blankspaceRowSelect').click(function()
							{
								$('#ns1blankspacePayrollRuns td.ns1blankspaceRowShadedHighlight').removeClass('ns1blankspaceRowShadedHighlight');
								$('#' + this.id).parent().children().addClass('ns1blankspaceRowShadedHighlight');
								var aXHTMLElementID = (this.id).split('-');
								var sData = $('#' + this.id).attr('data-employeeText');
								$.extend(true, oParam, {step: 2, pay: aXHTMLElementID[1], employeeText: sData});
								ns1blankspace.financial.payroll.pays(oParam);
							})
						}
					}

					//PAY RECORD DETAILS
					else if (iStep == 2)
					{	
						if (oResponse == undefined)
						{
							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspacePayrollPayRunColumn1" class="ns1blankspaceColumn1" style="width:200px;padding-right:5px;font-size:0.875em;">' +
												ns1blankspace.xhtml.loadingSmall + '</td>' +
											'<td id="ns1blankspacePayrollPayRunColumn2" class="ns1blankspaceColumn2" style="width:200px;padding-right:15px;font-size:0.875em;"></td>' +
											'<td id="ns1blankspacePayrollPayRunColumn3" class="ns1blankspaceColumn2"></td>' +
											'</tr>' + 
											'</table>');	

							$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));
							
							var aHTML = [];
							
							aHTML.push('<div id="ns1blankspaceFinancialPayrollColumnItem" style="width: 200px;margin-bottom:3px;"></div>');

							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollColumnItemType').buttonset().css('font-size', '0.75em');

							$('#ns1blankspaceFinancialPayrollColumnItemType :radio').click(function()
							{
								var aID = (this.id).split('-');
								$.extend(true, oParam, {step: aID[1]});
								ns1blankspace.financial.payroll.pays(oParam);
							});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
							oSearch.addFilter('id', 'EQUAL_TO', iPay)
							oSearch.addField('grosssalary,calculations,netsalary,deductions,allowances,superannuation,calculations,notes,' +
												'payrecord.employee.contactperson,hecs,leaveloading,posttaxsuper,pretaxsuper,rebate,' +
												'studentloandeduction,taxadjustments,taxafterrebate,taxbeforerebate,taxadjustments' +
												',employee' +
												',payrecord.employee.annualleaveentitlement' +
												',payrecord.employee.longserviceentitlement' +
												',payrecord.employee.sickleaveentitlement' +
												',payrecord.employee.superannuationrate' +
												',supercalculationmonthallowances' +
											 	',supercalculationmonthexclusion' +
											 	',supercalculationmonthinitialgrosssalary' +
											 	',supercalculationmonthinitialsuperannuation' +
											 	',supercalculationmonthleaveloading' +
											 	',supercalculationmonthsalarysacrificesuper' +
											 	',supercalculationmonthposthighincomecap' +
											 	',supercalculationmonthpreviouscalculation' +
											 	',supercalculationrate');

							oSearch.rows = 1;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							ns1blankspace.objectContextData.pay = oResponse.data.rows[0];

							$.extend(true, oParam, {step: 3});
							ns1blankspace.financial.payroll.pays(oParam);

							var aHTML = [];
							
							if (oResponse.data.rows.length != 0)
							{
								var oRow = oResponse.data.rows[0];

								aHTML.push('<table class="ns1blankspaceColumn2" style="padding-right:10px;">');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Gross</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["grosssalary"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Tax</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["taxbeforerebate"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Tax Adjustments</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["taxadjustments"] +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">Net</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["netsalary"] +
												'</td></tr>');

								aHTML.push('<tr><td colspan=2 class="ns1blankspaceCaption" style="font-size:0.875em;">' +
												 'Notes</td></tr>');

								aHTML.push('<tr><td colspan=2 id="ns1blankspaceFinancialPayrollPayNoteContainer" style="display:table-cell; text-align:right; border-width:0px;" class="ns1blankspaceRow">' +
												'<textarea rows="10" cols="35" id="ns1blankspaceFinancialPayrollPayNote" class="ns1blankspaceTextMulti"'+
												' style="width:100%; height:100px;">' + oRow["notes"] + '</textarea>' +
												'</td></tr>');	
											
								aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="2" style="padding-top:12px;">' +
												'Superannuation</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceSub" colspan="2" style="font-size:0.825em;">' +
												'Superannuation is calculated on a monthly basis.</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub" colspan="2" style="font-size:0.825em; padding-bottom:8px;">' +
												'Below is the cumulative superannuation calculations for pays with a pay date in the month of <b>' +
												moment(ns1blankspace.objectContextData.paydate, ns1blankspace.option.dateFormats).format('MMMM YYYY') + 
												'</b> with a pay date on or prior to ' +
												ns1blankspace.objectContextData.paydate + '.</td></tr>');

								var cSuper = 
								{
									initialGrossSalary: numeral(oRow["supercalculationmonthinitialgrosssalary"]).value(),
									leaveLoading: numeral(oRow["supercalculationmonthleaveloading"]).value(),
									exclusions: numeral(oRow["supercalculationmonthexclusion"]).value(),
									allowances: numeral(oRow["supercalculationmonthallowances"]).value(),
									salarysSacrifice: numeral(oRow["supercalculationmonthsalarysacrificesuper"]).value(),
									rate: numeral(oRow["supercalculationrate"]).value(),
									contribution: 0,
									payable: false
								}

								if (cSuper.rate == 0)
								{
									cSuper.rate = numeral(oRow["payrecord.employee.superannuationrate"]).value()
								}

								cSuper.total = 
								(
									cSuper.initialGrossSalary
									- cSuper.leaveLoading
									- cSuper.exclusions
									+ cSuper.allowances
									+ cSuper.salarysSacrifice
								)

								if (cSuper.total >= 450)
								{
									cSuper.payable = true;
									cSuper.contribution = cSuper.total * cSuper.rate / 100;
								}

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Gross Salary</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["supercalculationmonthinitialgrosssalary"]  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'<i>minus</i> Leave Loading</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["supercalculationmonthleaveloading"]  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'<i>minus</i> Superannuation Excluded Activity</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["supercalculationmonthexclusion"]  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'<i>plus</i> Allowances</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["supercalculationmonthallowances"]  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'<i>plus</i> Salary Sacrificed as Superannuation</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["supercalculationmonthsalarysacrificesuper"]  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Gross for Superannuation</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												numeral(cSuper.total).format('(0,0.00)') +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Superannuation Rate</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												numeral(cSuper.rate).format('(0,0.00)') + '%' +
												'</td></tr>');

								if (!cSuper.payable)
								{
									aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub" colspan="2">' +
												'Superannuation contribution is not required as <i>Gross for Superannuation</i> is under the threshold.</td>');
								}

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Cumulative Contribution</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												numeral(cSuper.contribution).format('(0,0.00)') +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceCaption">This Pays Contribution</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												oRow["superannuation"] +
												'</td></tr>');

								aHTML.push('<tr><td style="padding-top:10px;" colspan=2 class="ns1blankspaceSubNote ns1blankspaceRowSelect" id="ns1blankspaceFinancialPayrollShowCalcs">Show All Calculations</td></tr>');

								aHTML.push('<tr><td colspan=2 id="ns1blankspaceFinancialPayrollCalcsContainer" class="ns1blankspaceSub" style="color:#444444;"></td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="2" style="padding-top:8px;">' +
												'Leave</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceSub" colspan="2" style="font-size:0.825em;">' +
												'Standard leave entitlements (as hours) for this employee per completed pay run.</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Annual</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												(oRow["payrecord.employee.annualleaveentitlement"]==''?'0.00':oRow["payrecord.employee.annualleaveentitlement"])  +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Sick</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												(oRow["payrecord.employee.sickleaveentitlement"]==''?'0.00':oRow["payrecord.employee.sickleaveentitlement"]) +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Long Service</td>' +
												'<td class="ns1blankspaceRow" style="text-align:right;">' +
												(oRow["payrecord.employee.longserviceentitlement"]==''?'0.00':oRow["payrecord.employee.longserviceentitlement"]) +
												'</td></tr>');

								aHTML.push('<tr id="ns1blankspaceFinancialPayrollAccumulatedLeave">' +
												'<td class="ns1blankspaceSub" colspan="2" style="font-size:0.825em; padding-top:12px;">' +
												'Accumulated leave entitlements (as hours) for this employee as at ' + moment().format('Do MMMM YYYY') + '.</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Annual</td>' +
												'<td id="ns1blankspaceFinancialPayrollAccumulatedLeaveAnnual" class="ns1blankspaceRow" style="text-align:right;">' +
												'...' +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Sick</td>' +
												'<td id="ns1blankspaceFinancialPayrollAccumulatedLeaveSick" class="ns1blankspaceRow" style="text-align:right;">' +
												'...' +
												'</td></tr>');

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">' +
												'Long Service</td>' +
												'<td id="ns1blankspaceFinancialPayrollAccumulatedLeaveLongService" class="ns1blankspaceRow" style="text-align:right;">' +
												'...' +
												'</td></tr>');

								aHTML.push('<tr><td colspan=2 style="padding-top:20px;" class="ns1blankspaceSubNote ns1blankspaceRowSelect" id="ns1blankspaceFinancialPayrollRecalculate">Recalculate this pay</td></tr>');

								aHTML.push('</table>');

								/*

								https://docs.mydigitalstructure.com/financial_payroll_pay_record_search

								MonthGrossSalary = SuperCalculationMonthInitialGrossSalary
								- SuperCalculationMonthLeaveLoading
								- SuperCalculationMonthExclusion
								+ SuperCalculationMonthAllowances
								- SuperCalculationMonthSalarySacrificeSuper

								*/

								$('#ns1blankspacePayrollPay_grosssalary-' + iPay).html(oRow["grosssalary"])
								$('#ns1blankspacePayrollPay_tax-' + iPay).html(oRow["taxbeforerebate"])
								$('#ns1blankspacePayrollPay_taxadjustments-' + iPay).html(oRow["taxadjustments"])
								$('#ns1blankspacePayrollPay_netsalary-' + iPay).html(oRow["netsalary"])	
								$('#ns1blankspacePayrollPay_superannuation-' + iPay).html(oRow["superannuation"]);

								var oSearch = new AdvancedSearch();
								oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_SEARCH';
								oSearch.addField('type,sum(hours) hours');
								oSearch.addFilter('employee', 'EQUAL_TO', oRow["employee"]);
								oSearch.rows = 9999;

								oSearch.getResults(function(oResponse)
								{
									var oLeaveType;
									var aLeave = oResponse.data.rows;
									
									var cLeaveTotalAnnual = 0;
									var cLeaveTotalSick = 0;
									var cLeaveTotalLongService = 0;

									if (aLeave.length != 0)
									{
										oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 1});
										if (oLeaveType != undefined) {cLeaveTotalAnnual = oLeaveType.hours};

										oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 2});
										if (oLeaveType != undefined) {cLeaveTotalSick = oLeaveType.hours};

										oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 3});
										if (oLeaveType != undefined) {cLeaveTotalLongService = oLeaveType.hours};
									}

									$('#ns1blankspaceFinancialPayrollAccumulatedLeaveAnnual').html(numeral(cLeaveTotalAnnual).format('0,0.00'));
									$('#ns1blankspaceFinancialPayrollAccumulatedLeaveSick').html(numeral(cLeaveTotalSick).format('0,0.00'));
									$('#ns1blankspaceFinancialPayrollAccumulatedLeaveLongService').html(numeral(cLeaveTotalLongService).format('0,0.00'));
								});
																							
							}
								
							$('#ns1blankspacePayrollPayRunColumn1').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollPayNote').keyup(function()
							{
								ns1blankspace.financial.payroll.data.itemNotes = $('#ns1blankspaceFinancialPayrollPayNote').val()
							});

							$('#ns1blankspaceFinancialPayrollPayNote').focusout(function()
							{
								var oData =
								{
									id: ns1blankspace.objectContextData.pay.id,
									notes: ns1blankspace.financial.payroll.data.itemNotes
								}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function(data)
									{
										if (data.status != 'OK')
										{
											ns1blankspace.status.message('Note could not be saved.');
										}	
									}
								});	
							});

							$('#ns1blankspaceFinancialPayrollShowCalcs').click(function ()
							{
								$('#ns1blankspaceFinancialPayrollShowCalcs').hide();

								var oSearch = new AdvancedSearch();
								oSearch.method = 'FINANCIAL_PAYROLL_PAY_PROCESS_LOG_SEARCH';
								oSearch.addField('notes');
								oSearch.addFilter('payrecord', 'EQUAL_TO', ns1blankspace.objectContextData.pay.id);
								oSearch.rows = 100;
								
								oSearch.getResults(function(oResponse)
								{
									var sHTML;

									if (oResponse.data.rows.length == 0)
									{	
										sHTML = 'No calculations';
									}
									else
									{
										sHTML = $.map(oResponse.data.rows, function (log)
										{
											var sReturn;

											if (log.notes.indexOf('Scale:') == -1)
											{
												sReturn = '<div class="ns1blankspaceSubNote" style="padding-top:6px; color:#444444;">' + log.notes + '</div>';
											}
											else
											{
												sReturn = $.map(log.notes.split(','), function (scale) {return '<div class="ns1blankspaceSubNote" style="padding-top:6px; color:#444444;">' + scale + '</div>'});
											}

											return sReturn
										});
									}

									$('#ns1blankspaceFinancialPayrollCalcsContainer').html(sHTML);
								});
							});

							$('#ns1blankspaceFinancialPayrollRecalculate').click(function ()
							{
								ns1blankspace.status.working('Recalculating')
			
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
									data: 'type=4&record=' + ns1blankspace.objectContextData.pay.id,
									dataType: 'json',
									success: function(data)
									{
										ns1blankspace.status.message('Updated');
										$.extend(true, oParam, {step: 2});
										ns1blankspace.financial.payroll.pays(oParam);
									}
								});
							});
						}
					}

					//TIME
					else if (iStep == 3)
					{	
						if (oResponse == undefined)
						{
							var aHTML = [];
						
							aHTML.push('<table class="ns1blankspaceColumn2">');

							if (ns1blankspace.objectContextData.status == "1")
							{
								aHTML.push('<tr><td >' +
											'<span id="ns1blankspaceFinancialPayrollAdd" class="ns1blankspaceAction">Add</span>' +
											'</td></tr>');
							}
							else
							{
								aHTML.push('<tr><td id="ns1blankspaceFinancialPayrollExpenses_container">' +
											'<span id="ns1blankspaceFinancialPayrollExpenses" class="ns1blankspaceAction">Expenses</span>' +
											'</td></tr>');
							}				
															
							aHTML.push('</table>');					
							
							$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));						

							$('#ns1blankspaceFinancialPayrollExpenses').button(
							{
								label: "Show Salary Expense"
							})
							.click(function()
							{
								$('#ns1blankspacePayrollPayRunColumn3').html(ns1blankspace.xhtml.loadingSmall);
								$.extend(true, oParam, {step: 10, xhtmlElementID: ""});
								ns1blankspace.financial.payroll.pays(oParam);
							}).
							css('width', '90px');

							$('#ns1blankspaceFinancialPayrollAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								$.extend(true, oParam, {step: 4, xhtmlElementID: ""});
								ns1blankspace.financial.payroll.pays(oParam);
							})

							$('#ns1blankspacePayrollPayRunColumn2').html(ns1blankspace.xhtml.loadingSmall);
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('type,typetext,hours,rate,total,includeinsuper,manuallyupdated,notes,standardline,standardlinetext,taxable');
							oSearch.addFilter('record', 'EQUAL_TO', iPay);
							oSearch.rows = 100;
							oSearch.sort('typetext', 'asc')
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var sClass = (ns1blankspace.objectContextData.status == 2?'':' ns1blankspaceRowSelect');

							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceFinancialPayrollItem" class="ns1blankspaceColumn2">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr><td class="ns1blankspaceNothing">No items.</td></tr></table>');
							}
							else
							{		
								$(oResponse.data.rows).each(function(i, item)
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_type-' + item.id + '" class="ns1blankspaceRow ' + sClass + '">' +
															'<div>' + item.typetext + '</div>' +
															'<div class="ns1blankspaceSubNote">' + item.notes + '</div>' + 
														'</td>');

									var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: item.type});
									var oIncludeIn = $.grep(aIncludeIn, function (i) {return !i.dependant})[0];

									var bHours = (oIncludeIn!==undefined?$.grep(aIncludeIn, function (i) {return !i.dependant})[0].hours:false);
									var cAmount = numeral((bHours?item.hours:item.rate)).value();
									
									if (bHours)
									{
										aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(cAmount).format('(0,0.00)') + 
															'<br /><span class="ns1blankspaceSubNote">' + (bHours?'hours&nbsp;@&nbsp;' + ns1blankspace.option.currencySymbol + 
															numeral(item.rate).format('(0,0.00)'):ns1blankspace.option.currencySymbol) + '</span>' +
															'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol +
															numeral(item.total).format('(0,0.00)') + '</span>' +
															
														'</td>');
									}
									else
									{
										aHTML.push('<td id="ns1blankspaceFinancialPayPeriodItem_amount-' + item.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(cAmount).format('(0,0.00)') +
															'<br /><span class="ns1blankspaceSubNote">' + ns1blankspace.option.currencySymbol + 
																numeral(item.total).format('(0,0.00)') + '</span> ' +
														'</td>');					 			
									}

									if (ns1blankspace.objectContextData.status == "1")
									{
										aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPay_remove-' + item.id + '" class="ns1blankspaceRowRemove"></span></td>');
									}							
																												
									aHTML.push('</tr>');
								});	
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspacePayrollPayRunColumn2').html(aHTML.join(''));

							if (ns1blankspace.objectContextData.status == "1")
							{
								$('#ns1blankspaceFinancialPayrollItem span.ns1blankspaceRowRemove').button(
								{
									text: false,
								 	icons: {primary: "ui-icon-close"}
								})
								.click(function()
								{
									$.extend(true, oParam, {step: 6, xhtmlElementID: this.id});
									ns1blankspace.financial.payroll.pays(oParam)
								})
								.css('width', '15px')
								.css('height', '20px');

								$('#ns1blankspaceFinancialPayrollItem td.ns1blankspaceRowSelect').click(function()
								{
									$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
									ns1blankspace.financial.payroll.pays(oParam)
								})
								.css('width', '15px')
								.css('height', '20px')
							}
						}
					}

					else if (iStep == 13)
					{
						var sSearch = ns1blankspace.util.getParam(oParam, 'searchText', {"default": ''}).value;
						var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": false}).value;

						var aData = $.grep(ns1blankspace.financial.payroll.data.linetypes, function (type)
						{ 
							var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: type.id});
							var bInclude = ($.grep(aIncludeIn, function (include) {return !include.selectable}).length == 0)

							if (bInclude && sSearch != '' && !bAll) {bInclude = ((type.title).toLowerCase().indexOf(sSearch.toLowerCase()) != -1)}

							return bInclude
						});
						
						$vq.clear({queue: 'type'});

						if (aData.length == 0)
						{
							$vq.add('<table class="ns1blankspace">' +
											'<tr><td class="ns1blankspaceSubNote">No pay types.</td></tr>' + 
											'</table>', {queue: 'type'});

							$vq.render('#ns1blankspacePayrollItemTypeSearchResults', {queue: 'type'});		
						}
						else
						{	
							$vq.add('<table class="ns1blankspace">', {queue: 'type'});
							
							$.each(aData, function(d, data) 
							{ 
								$vq.add('<tr class="ns1blankspaceRow">'+ 
												'<td id="ns1blankspaceTypeem_title-' + data.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
												data.title + '</td></tr>', {queue: 'type'});	
							});
							
							$vq.add('</table>');

							$vq.render('#ns1blankspacePayrollItemTypeSearchResults', {queue: 'type'});
							
							$('.ns1blankspaceRowSelect')
							.click(function()
							{
								var sID = this.id;
								var aID = sID.split('-');

								$('#ns1blankspacePayrollItemType').attr('data-id', aID[1]);
								$('#ns1blankspacePayrollItemType').val($(this).html());
								$('#ns1blankspacePayrollItemTypeSearchResults').html('');

								ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: aID[1]});
							});
						}
					}
						
					// TIME DETAILS
					else if (iStep == 4)
					{
						var sID; 
						var iType;
						var sXHTMLElementID;

						if (oParam != undefined)
						{
							if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
							if (oParam.type != undefined) {iType = oParam.type}
						}
						
						if (sXHTMLElementID != undefined)
						{
							var aXHTMLElementID = sXHTMLElementID.split('-');
							var sID = aXHTMLElementID[1];
						}	
					
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
									
						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Type' +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspacePayrollItemType" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-bottom:5px;" id="ns1blankspacePayrollItemTypeSearchResults">' +
										'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all pay types<br />or just start typing.</span></td></tr>');
													
						aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
										ns1blankspace.financial.payroll.data.payPeriods[ns1blankspace.financial.data.settings.payrollpayperiod] +
										' Hours</td></tr>' +
										'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
										'<input id="ns1blankspacePayrollItemHours" class="ns1blankspaceText">' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceCaption includein includeinhoursY">' +
										'Pay Rate</td></tr>' +
										'<tr><td class="includein includeinhoursY ns1blankspaceText">' +
										'<input id="ns1blankspacePayrollItemPayRate" class="ns1blankspaceText">' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceSubNote">Leave this blank to use the employee\'s default pay rate.</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption includein includeinhoursX">' +
										ns1blankspace.option.currencySymbol +
										'/Hour</td></tr>' +
										'<tr><td class="ns1blankspaceCaption includein includeinhoursN">' +
										ns1blankspace.option.currencySymbol +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceText includein includeinhoursN">' +
										'<input id="ns1blankspacePayrollItemAmount" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceCaption">' +
										'Additional Information</td></tr>' +
										'<tr><td class="ns1blankspaceText">' +
										'<input id="ns1blankspacePayrollItemNotes" class="ns1blankspaceText">' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollPayRunColumn2').html(aHTML.join(''));

						$('#ns1blankspacePayrollItemType').keyup(function(e)
						{
							$.extend(true, oParam, {step: 13, searchText: $(this).val(), all: (e.which === 13)});
							ns1blankspace.financial.payroll.pays(oParam)
						});
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
								
						aHTML.push('<tr><td>' +
										'<span style="width:70px;" id="ns1blankspaceItemEditSave" class="ns1blankspaceAction">Save</span>' +
										'</td></tr>');
										
						aHTML.push('<tr><td>' +
											'<span style="width:70px;" id="ns1blankspaceItemEditCancel" class="ns1blankspaceAction">Cancel</span>' +
											'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceItemEditAbout"></td></tr>');
															
						aHTML.push('</table>');					
							
						$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));
						
						$('#ns1blankspaceItemEditSave').button(
						{
							text: "Save"
						})
						.click(function()
						{
							ns1blankspace.status.working();

							var iHours = ($('#ns1blankspacePayrollItemHours').is(':visible')?$('#ns1blankspacePayrollItemHours').val():1)

							var oData =
							{
								record: iPay,
								type: $('#ns1blankspacePayrollItemType').attr('data-id'),
								hours: iHours,
								id: sID,
								notes: $('#ns1blankspacePayrollItemNotes').val()
							};

							if ($('#ns1blankspacePayrollItemAmount').is(':visible'))
							{	
								oData.rate = $('#ns1blankspacePayrollItemAmount').val();
							}

							if ($('#ns1blankspacePayrollItemPayRate').is(':visible'))
							{	
								if ($('#ns1blankspacePayrollItemPayRate').val() != '')
								{
									oData.rate = $('#ns1blankspacePayrollItemPayRate').val();
								}	
							}

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_ITEM_MANAGE'),
								data: oData,
								dataType: 'json',
								success: function(data)
								{
									if (data.status == "OK")
									{
										ns1blankspace.inputDetected = false;
										$.extend(true, oParam, {step: 7});
										ns1blankspace.financial.payroll.pays(oParam)
									}
									else
									{
										ns1blankspace.status.error(data.error.errornotes);
									}
								}
							});
						});

						$('#ns1blankspaceItemEditCancel').button(
						{
							text: "Cancel"
						})
						.click(function() 
						{
							$.extend(true, oParam, {step: 2});
							ns1blankspace.financial.payroll.pays(oParam);
						});

						if (sID != undefined)
						{
							$('#ns1blankspacePayrollItemHours').focus();

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('hours,type,typetext,rate,total,notes');
							oSearch.addFilter('id', 'EQUAL_TO', sID);
							oSearch.getResults(function(data) {
									$.extend(true, oParam, {step: 5});
									ns1blankspace.financial.payroll.pays(oParam, data)
									});
						}
						else
						{
							$('#ns1blankspacePayrollItemType').focus();
							$('[name="radioItemType"][value="1"]').attr('checked', true);

							ns1blankspace.financial.payroll.util.linetypes.showHide();

							$.extend(true, oParam, {step: 13, searchText: ''});
							ns1blankspace.financial.payroll.pays(oParam);
						}
					}

					else if (iStep == 5)
					{
						if (oResponse.data.rows.length != 0)
						{
							var oObjectContext = oResponse.data.rows[0];
							$('#ns1blankspacePayrollItemHours').val(numeral(oObjectContext.hours).format('(0,0.00)'));
							$('#ns1blankspacePayrollItemAmount').val(numeral(oObjectContext.rate).format('(0,0.00)'));
							$('#ns1blankspacePayrollItemType').val(oObjectContext.typetext);
							$('#ns1blankspacePayrollItemType').attr('data-id', oObjectContext.type);
							$('#ns1blankspacePayrollItemPayRate').val(numeral(oObjectContext.rate).format('(0,0.00)'));
							$('#ns1blankspacePayrollItemNotes').val(oObjectContext.notes);

							ns1blankspace.financial.payroll.util.linetypes.showHide({lineType: oObjectContext.type});
							$('.includein :visible:first').focus().select();
						}
					}

					else if (iStep == 6)
					{
						var sID; 
						var iType;
						var sXHTMLElementID;

						if (oParam != undefined)
						{
							if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
							if (oParam.type != undefined) {iType = oParam.type}
						}
						
						if (sXHTMLElementID != undefined)
						{
							var aXHTMLElementID = sXHTMLElementID.split('-');
							var sID = aXHTMLElementID[1];
						}	
								
						if (oResponse == undefined)
						{	
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_ITEM_MANAGE'),
								data: 'remove=1&id=' + sID,
								dataType: 'json',
								success: function(data)
								{
									$.extend(true, oParam, {step: 7});
									ns1blankspace.financial.payroll.pays(oParam, data);
								}
							});
						}	
						else
						{
							if (oResponse.status == 'OK')
							{
								$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
							}
							else
							{
								ns1blankspace.status.error(oResponse.error.errornotes);
							}
						}	
					}

					else if (iStep == 7)
					{
						var iType = 4;
						
						var sXHTMLElementID;
	
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PROCESS'),
							data: 'type=' + iType + '&record=' + iPay,
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.status.message('Updated');
								$.extend(true, oParam, {step: 2});
								ns1blankspace.financial.payroll.pays(oParam);
							}
						});
					}

					//EXPENSES
					else if (iStep == 10)
					{	
						if (oResponse == undefined)
						{
							$('#ns1blankspaceFinancialPayrollColumnItem').html(ns1blankspace.xhtml.loadingSmall);
							    
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
							oSearch.addField('description,amount');
							oSearch.addFilter('object', 'EQUAL_TO', '37');
							oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
							oSearch.addFilter('contactpersonpaidto', 'EQUAL_TO', ns1blankspace.objectContextData.pay["payrecord.employee.contactperson"]);
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)})	
						}
						else
						{
							var aHTML = [];
					
							aHTML.push('<table id="ns1blankspaceFinancialPayrollExpenses" class="ns1blankspaceColumn2" style="font-size:0.875em;">');
						
							if (oResponse.data.rows.length == 0)
							{
								aHTML.push('<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceSub">No expenses</td></tr>');
								aHTML.push('</table>');
							}
							else
							{		
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">Expenses</td>');
								aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
								aHTML.push('</tr>');
								
								$(oResponse.data.rows).each(function()
								{
									aHTML.push('<tr class="ns1blankspaceRow">');
										
									aHTML.push('<td id="ns1blankspaceFinancialPayPeriodExpenseItem_Description-' + this.id + '" class="ns1blankspaceRow">' +
															this["description"]);

									aHTML.push('<div id="ns1blankspaceFinancialPayPeriodExpenseItem_Amount-' + this.id + '" class="ns1blankspaceSub">$' +
															 parseFloat(this["amount"].replace(',', '')).toFixed(2) + '</div></td>');

									aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
													'<span id="ns1blankspacePayrollPayExpense_view-' + this.id + '" class="ns1blankspaceRowView"></span></td>');						 					
																																
									aHTML.push('</tr>');
								});	
							}
								
							aHTML.push('</table>');
						
							$('#ns1blankspacePayrollPayRunColumn3').html(aHTML.join(''));

							$('#ns1blankspaceFinancialPayrollExpenses .ns1blankspaceRowView')
							.button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-play"
								}
							})
							.click(function()
							{
								ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
							})
							.css('width', ns1blankspace.option.rowButtonWidth)
							.css('height', ns1blankspace.option.rowButtonHeight);
						}
					}

					//ADD PAY RECORD
					else if (iStep == 11)
					{	
						var aHTML = [];

						if (oResponse == undefined)
						{	
							aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePayrollPayAddEmployeeColumn1" style="font-size:0.875em;">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspacePayrollPayAddEmployeeColumn2" style="width:100px;">' +
										'</td>' +
										'</tr>' + 
										'</table>');				
											
							$('#ns1blankspacePayrollPayColumn2').html(aHTML.join(''));

							$('#ns1blankspacePayrollPayAddEmployeeColumn1').html(ns1blankspace.xhtml.loading);

							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePayrollPayAddEmployee" class="ns1blankspaceColumn2">'+ 
											'<tr><td><span style="width:70px;" id="ns1blankspacePayrollPayAddEmployeeCancel" class="ns1blankspaceAction">' +
												'Cancel</span></td></tr>');
																
							aHTML.push('</table>');					
								
							$('#ns1blankspacePayrollPayAddEmployeeColumn2').html(aHTML.join(''));
							
							$('#ns1blankspacePayrollPayAddEmployeeCancel').button(
							{
								text: "Cancel"
							})
							.click(function() 
							{
								$.extend(true, oParam, {step: 1});
								ns1blankspace.financial.payroll.pays(oParam);
							});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
							oSearch.addField('contactpersontext,employmentstartdate,statustext,employeenumber,employee.contactperson.firstname,employee.contactperson.surname');
							oSearch.addFilter('status', 'EQUAL_TO', '2')
							oSearch.rows = 50;
							oSearch.sort('employeenumber', 'asc');
							oSearch.sort('employee.contactperson.firstname', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays(oParam, data)});

						}
						else
						{

							var aHTML = [];

							aHTML.push('<table class="ns1blankspace">');
							
							$.each(oResponse.data.rows, function() 
							{ 
								aHTML.push('<tr class="ns1blankspaceRow">'+ 
												'<td id="ns1blankspaceEmployee_name-' + this.id + '" class="ns1blankspaceRow">' +
												this.contactpersontext + '</td>' +
												'<td id="ns1blankspaceEmployee_name-' + this.id + '" class="ns1blankspaceRow">' +
												this.employeenumber + '</td>' +
												'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
												'<span id="ns1blankspaceEmployee_options_add-' + this.id + '" class="ns1blankspaceEmployeeAdd"></span>' +
												'</td></tr>');	
							});
							
							aHTML.push('</table>');

							$('#ns1blankspacePayrollPayAddEmployeeColumn1').html(aHTML.join(''));

							$('.ns1blankspaceEmployeeAdd').button(
							{	
								text: false,
								icons:
								{
									primary: "ui-icon-plus"
								}
							})
							.click(function() 
							{
								ns1blankspace.status.working();

								var iEmployee = (this.id).split('-')[1];

								var sData = 'period=' +  ns1blankspace.util.fs(ns1blankspace.objectContext);
								sData += '&employee=' + ns1blankspace.util.fs(iEmployee);

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
									data: sData,
									dataType: 'json',
									success: function(data)
									{
										if (data.status == "OK")
										{
											ns1blankspace.status.message('Saved');
											oParam.step = 1;
											ns1blankspace.financial.payroll.pays(oParam)
										}
										else
										{
											ns1blankspace.status.error(data.error.errornotes);
										}
									}
								});
							})
							.css('height', '18px');
						}
					}

					else if (iStep == 12)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_RECORD_MANAGE'),
							data: 'remove=1&id=' + iPay,
							dataType: 'json',
							success: function(data)
							{
								if (data.status == 'OK')
								{
									ns1blankspace.status.message('Removed');
									oParam.step = 1;
									oParam.pay = undefined;
									ns1blankspace.financial.payroll.pays(oParam);
								}
								else
								{
									ns1blankspace.status.error(data.error.errornotes);
								}
							}
						});
					}		
				},

	complete: 	function(oParam, oResponse)
				{
					ns1blankspace.status.working('Completing...');

					var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;

					if (iStep == 1)
					{	
						if (ns1blankspace.financial.data.settings.payrollcreateexpenses == 'Y')
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_CREATE_EXPENSES'),
								data: 'period=' + ns1blankspace.objectContext,
								dataType: 'json',
								success: function(data)
								{
									//if (data.status == 'OK')
									//{	
										ns1blankspace.financial.payroll.complete({step: 3})
									//}
								}	
							});
						}
						else
						{
							ns1blankspace.financial.payroll.complete({step: 3})
						}
					}

					if (iStep == 3)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
							data: 'status=2&id=' + ns1blankspace.objectContext,
							dataType: 'json',
							success: function()
							{	
								ns1blankspace.status.clear();
								ns1blankspace.financial.payroll.search.send('-' + ns1blankspace.objectContext);
							}
						});
					}	
				},

	financials:
				{
					show: 	function (oParam)
								{
									$vq.clear({queue: 'financials'});

									$vq.add('<table>' +
												'<tr>' +
												'<td class="ns1blankspaceCaption">Expenses</td><td style="text-align:right; padding-right:8px;"><span id="ns1blankspacePayrollFinancialsCheckSuper"></td>' +
												'</tr>' +
												'<tr>' +
												'<td colspan=2 id="ns1blankspacePayrollFinancialsExpenses" style="padding-bottom:14px;">' + ns1blankspace.xhtml.loadingSmall + '</td>' +
												'</tr>' +
												'</table>' +
												'<table>' +
												'<tr>' +
												'<td class="ns1blankspaceCaption">Journals</td>' +
												'</tr>' +
												'<tr class="ns1blankspaceContainer">' +
												'<td id="ns1blankspacePayrollFinancialsJournals">' + ns1blankspace.xhtml.loadingSmall + '</td>' +
												'</tr>' +
												'</table>', {queue: 'financials'});	

									$vq.render('#ns1blankspaceMainExpenses', {queue: 'financials'});

									$('#ns1blankspacePayrollFinancialsCheckSuper')
									.button(
									{
										label: 'Check Superannuation Expenses',
										icons: false
									})
									.click(function(event)
									{
										ns1blankspace.financial.payroll.util.superannuation.pays(oParam);
									})
									.css('font-size', '0.625em');

									ns1blankspace.financial.payroll.expenses.show()
								}
				},

	expenses: 	
				{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
										oSearch.addField('description,amount');
										oSearch.addFilter('object', 'EQUAL_TO', '37');
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.expenses.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No expenses.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');

											$('#ns1blankspacePayrollFinancialsExpenses').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.expenses.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspacePayrollFinancialsExpenses',
												xhtmlContext: 'FinancialPayrollExpense',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.expenses.row,
												functionOnNewPage: ns1blankspace.financial.payroll.expenses.bind,
												type: 'json',
												headerRow: false
											});
										}

										ns1blankspace.financial.payroll.journals.show()
									}	
								},

					row: 		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollExpense_description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollExpense_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															oRow.amount + '</td>');						
																																													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPayrollExpense_view-' + oRow.id +
													'" class="ns1blankspaceRow ns1blankspaceRowView"></span>' +
													'</td>');
																							
									aHTML.push('</tr>');	
									
									return aHTML.join('');
								},

					bind: 		function (oParam)
								{
									var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;

									$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');
								}
				},

	journals: 	
				{
					show:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('id,journaldate,description,sum(generaljournal.generaljournalitem.creditamount) totalamount');
										oSearch.addFilter('object', 'EQUAL_TO', '37');
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContextData.id);
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.journals.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table>');
											aHTML.push('<tr>');
											aHTML.push('<td class="ns1blankspaceNothing">No journals.</td>');
											aHTML.push('</tr>');
											aHTML.push('</table>');

											$('#ns1blankspacePayrollFinancialsJournals').html(aHTML.join(''));		
										}
										else
										{
										
											aHTML.push('<table>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.payroll.journals.row(this));
											});
											
											aHTML.push('</table>');
											
											ns1blankspace.render.page.show(
											{
												xhtmlElementID: 'ns1blankspacePayrollFinancialsJournals',
												xhtmlContext: 'FinancialPayrollJournal',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.journals.row,
												functionOnNewPage: ns1blankspace.financial.payroll.journals.bind,
												type: 'json',
												headerRow: false
											});
										}
									}	
								},

					row: 		function (oRow)
								{
									var aHTML = [];
									
									aHTML.push('<tr class="ns1blankspaceRow">');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollJournal_description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>');
															
									aHTML.push('<td id="ns1blankspaceFinancialPayrollJournal_amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															numeral(oRow.totalamount).format('(0,0.00)') + '</td>');						
																																													
									aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
													'<span id="ns1blankspaceFinancialPayrollJournal_view-' + oRow.id +
													'" class="ns1blankspaceRow ns1blankspaceRowView"></span>' +
													'</td>');
																							
									aHTML.push('</tr>');	
									
									return aHTML.join('');
								},

					bind: 		function (oParam)
								{
									var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;

									$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowView').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-play"
										}
									})
									.click(function()
									{
										ns1blankspace.financial.journal.init({id: (this.id).split('-')[1]});
									})
									.css('width', '15px')
									.css('height', '20px');
								}
				}

}

ns1blankspace.financial.payroll.totals =
{
	init: 	function (oParam, oResponse)
				{
						var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod').value;
						
						ns1blankspace.financial.payroll.data.payPeriodFrequency = undefined;

						if (iPayPeriod == undefined)
						{
							ns1blankspace.financial.payroll.totals.show(oParam);
						}
						else
						{
							if (oResponse == undefined)
							{
								var oSearch = new AdvancedSearch();
								oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
								oSearch.addField('frequency');
								oSearch.addFilter('id', 'EQUAL_TO', iPayPeriod);
								oSearch.rows = 9999;
								oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.init(oParam, data)});	
							}
							else
							{
								ns1blankspace.financial.payroll.data.payPeriodFrequency = oResponse.data.rows[0].frequency;
								ns1blankspace.financial.payroll.totals.show(oParam);
							}
						}
				},

	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.data.defaults.enddate}).value;
					var sGUID = ns1blankspace.util.getParam(oParam, 'guid', {"default": sStartDate + '-' + sEndDate}).value;
					var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod').value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = ns1blankspace.financial.util.financialYear(moment().format('DD MMM YYYY')).start;
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;
					ns1blankspace.financial.payroll.data.guid = sGUID;

					if (iPayPeriod != undefined)
					{
						ns1blankspace.financial.payroll.data.payPeriodID = iPayPeriod;
					}

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollTotalsColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollTotalsColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainTotals').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:15px;" id="ns1blankspacePayrollSummary">' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollTotalsColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspacePayrollRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.totals.init(
							{
								startDate: $('#ns1blankspacePayrollStartDate').val(),
								endDate: $('#ns1blankspacePayrollEndDate').val()
							})
						});

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(allowances) allowances,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate,sum(taxadjustments) taxadjustments');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(netsalary) netsalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(taxadjustments) taxadjustments');
						oSearch.addSummaryField('sum(deductions) deductions');
						oSearch.addSummaryField('sum(allowances) allowances');

						if (sStartDate !== undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollEndDate').val(sEndDate);
						}

						if (iPayPeriod != undefined && ns1blankspace.financial.payroll.data.payPeriodFrequency != undefined)
						{
							oSearch.addFilter('payrecord.employee.payfrequency', 'EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriodFrequency)
						}

						oSearch.sort('payrecord.employee.contactpersontext', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.financial.payroll.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Net Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.netsalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax Adjustments</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxadjustments).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Allowances</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.allowances).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Deductions</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.deductions).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total Payroll</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollSummary').html(aHTML.join(''));

						ns1blankspace.financial.payroll.totals.employees.show(oParam);
					}	
				},

	employees: 	
				{
					show: 	function (oParam, oResponse)
								{
									var bShowAsList = ns1blankspace.util.getParam(oParam, 'showAsList', {"default": true}).value;
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
									var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod', {"default": ns1blankspace.financial.payroll.data.payPeriod}).value;

									if (oResponse == undefined)
									{
										ns1blankspace.financial.data.employee = [];

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeTotalsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeTotalsColumn2" style="width:95px;"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspacePayrollTotalsColumn2').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
										oSearch.addField('employee.contactpersontext,employee.employmentstartdate,employee.employmentenddate,employee.statustext,employee.employeenumber,employee.taxfilenumber,' +
															'employee.contactperson,employee.contactperson.firstname,employee.contactperson.surname,employee.contactperson.email,employee.contactperson.mobile,' +
															'employee.contactperson.streetaddress1,employee.contactperson.streetaddress2,employee.contactperson.streetsuburb,' +
															'employee.contactperson.streetstate,employee.contactperson.streetpostcode,employee.contactperson.streetcountry,employee.contactperson.dateofbirth,' +
															'employee.contactbusiness.tradename,employee.contactbusiness.abn,employee.contactbusiness.streetaddress1,employee.contactbusiness.streetaddress2,' +
															'employee.contactbusiness.streetsuburb,employee.contactbusiness.streetstate,employee.contactbusiness.streetpostcode,employee.contactbusiness.streetcountry,' +
															'employee.taxfreethreshold,employee.deducthelp,' +
															'employee.terminationtype,employee.terminationtypetext,employee.status,employee.taxtreatmentcode,employee.incometypecode');

										if (sStartDate != undefined)
										{
											oSearch.addBracket('(');
											oSearch.addFilter('employee.employmentenddate', 'IS_NULL');
											oSearch.addOperator('or');
											oSearch.addFilter('employee.employmentenddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
											oSearch.addBracket(')');
										}

										oSearch.addFilter('employee.status', 'NOT_EQUAL_TO', 1);

										if (iPayPeriod != undefined && ns1blankspace.financial.payroll.data.payPeriodFrequency != undefined)
										{
											oSearch.addFilter('employee.payfrequency', 'EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriodFrequency)
										}

										oSearch.rows = 999;
										oSearch.sort('employee.employeenumber', 'asc');
										oSearch.sort('employee.contactperson.firstname', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.employees.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr class="ns1blankspace">' +
															'<td class="ns1blankspaceNothing">No employees</td>' +
															'</tr></table>');

											$('#ns1blankspacePayrollEmployeeTotalsColumn1').html(aHTML.join(''));
										}
										else
										{
											if (ns1blankspace.financial.payroll.data._param.msalAccessToken != undefined)
											{
												//as ' + 
												//				ns1blankspace.financial.payroll.data._param.msalUsername + 
												//				' (' + ns1blankspace.financial.payroll.data._param.msalEmail + ')'

												aHTML.push('<div style="font-size:0.875em; margin-bottom:12px;" class="alert alert-warning"> ' +
															' <div><strong>You are now signed into the singletouch.com.au service</strong>.</div>' +
															' <div>You can continue with submitting the payroll data online to the ' + ns1blankspace.option.taxOffice +
															' using the <strong>View / Submit STP Data</strong> button on the right.</div></div>');

											}

											ns1blankspace.financial.payroll.data.employees = oResponse.data.rows;

											aHTML.push('<table id="ns1blankspacePayrollEmployeeTotals" class="ns1blankspace">' +
															'<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollEmployeeTotalsSelectAll"></span></td>' +
															'<td class="ns1blankspaceHeaderCaption">Employee</td>');

											if (bShowAsList)
											{
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Gross<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Tax<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Tax Adjustments<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.taxadjustments).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Net<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.netsalary).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Super.<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
												aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em;">Ded.<br />'+ 
																'<span style="font-size:0.75em;">' + (ns1blankspace.financial.payroll.data.payrecords.summary.deductions).parseCurrency().formatMoney(2, '.', ',') +
																'</span></td>');
											}
											else
											{
												aHTML.push('<td class="ns1blankspaceHeaderCaption">Pay</td>');
											}	

											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
															'</tr>');
											
											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.payroll.totals.employees.row(this));
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
										   {
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollEmployeeTotalsColumn1',
												xhtmlContext: 'Employees',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 200,
												functionShowRow: ns1blankspace.financial.payroll.totals.employees.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.totals.employees.bind,
										   });

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2" style="margin-right:0px;">');
				
											aHTML.push('<tr><td class="ns1blankspaceCaption" style="padding-top:0px;">' +
														ns1blankspace.option.taxOffice + ' Reporting</td></tr>');

											aHTML.push('<tr>' +
														'<td class="ns1blankspaceSubNote" style="padding-top:4px; font-weight:500;">' +
														'Payment Summaries</td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFile" class="ns1blankspaceAction" >' +
															'</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFileTest" class="ns1blankspaceAction" >' +
															'</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsFileSample" class="ns1blankspaceAction" >' +
															'</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsFileStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											if (iPayPeriod != undefined)
											{
												aHTML.push('<tr>' +
															'<td class="ns1blankspaceSubNote" style="padding-top:2px; font-weight:500;">' +
															'Single Touch Payroll</td></tr>');

												aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsSTPData" class="ns1blankspaceAction" >' +
																'</span></td></tr>');

												aHTML.push('<tr><td style="padding-bottom:14px;" class="ns1blankspaceSubNote">Mark as the final pay for the year <input type="checkbox" id="ns1blankspacePayrollTotalsSTPDataFinal"></td></tr>');
											}
											else
											{
												aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-bottom:14px;">To create a Single Touch Payroll report, select <b>Pay Runs</b> and then <b>Totals & ATO Reporting</b> for the period you need to submit.</td></tr>');
											}

											aHTML.push('<tr><td style="padding-top:14px; padding-bottom:2px; font-size:0.75em; border-top-style:solid; border-width:1px; border-color:#D0D0D0;" class="ns1blankspaceSub">' +
															'Create summaries for selected employees</td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsPreviewStatus" style="display:none; padding-top:2px; padding-bottom:2px; font-size:0.75em;" class="ns1blankspaceSub">' +
															'</td></tr>');
																	
											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsPreview" class="ns1blankspaceAction">' +
															'Show</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsEmail" class="ns1blankspaceAction">' +
															'Email</span></td></tr>');

											aHTML.push('<tr><td><span id="ns1blankspacePayrollTotalsPDF" class="ns1blankspaceAction">' +
															'PDF</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollTotalsEmailStatus" style="padding-top:4px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('<tr>' +
															'<td class="ns1blankspaceSubNote" style="padding-top:10px;">' +
															'Export totals as</td></tr>');
											
											aHTML.push('<tr><td style="padding-top:4px;"><span id="ns1blankspacePayrollTotalsDownload" class="ns1blankspaceAction">' +
															'CSV</span></td></tr>');

											aHTML.push('<tr><td style="padding-top:4px;"><span class="ns1blankspaceAction" id="ns1blankspacePayrollCreatePDF"  style="width:95px;">' +
															'PDF</span></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollEmployeeTotalsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspacePayrollTotalsPreview').button(
											{
												label: 'Show'
											})
											.click(function()
											{	
												delete oParam.step;
												delete oParam.dataIndex;
												delete oParam.dataItemIndex;
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam)
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsEmail').button(
											{
												label: 'Email'
											})
											.click(function()
											{	
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.email.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsPDF').button(
											{
												label: 'PDF'
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.pdf.process(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFile').button(
											{
												label: 'File'
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'P', sample: false}
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												oParam.fileMode = 'P';
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFileTest').button(
											{
												label: 'Test File'
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'T', sample: false}
												oParam.fileMode = 'T';
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsFileSample').button(
											{
												label: 'Show Sample'
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.totals.employees.file.data = {fileMode: 'T', sample: true}
												oParam.fileMode = 'T';
												oParam.sample = true;
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.file.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsSTPData').button(
											{
												label: 'View / Submit STP Data'
											})
											.click(function()
											{		
												ns1blankspace.financial.payroll.data.payPeriod = iPayPeriod;
												ns1blankspace.financial.payroll.data.isFinalForYear = ($('#ns1blankspacePayrollTotalsSTPDataFinal').prop('checked')?'true':'false');
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.report.init};
												ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollTotalsDownload').button(
											{
												label: 'CSV'
											})
											.click(function()
											{	
												var oData =
												{
													more: ns1blankspace.financial.payroll.data.payrecords.moreid,
													filename: 'payroll-totals.csv'
												}

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('CORE_MORE_FILE_MANAGE'),
													data: oData,
													dataType: 'json',
													success: function(data)
													{
														ns1blankspace.status.message('File created');
														window.open(data.link, '_self');
													}
												});
											})
											.css('width', '90px');

											$('#ns1blankspacePayrollCreatePDF').button(
											{
												label: 'PDF'
											})
											.click(function(event)
											{
												var sHTML = '<style>.ui-button, input {display:none;} td.ns1blankspaceRowSelect {color:#000000;}</style>' +
																$('#ns1blankspacePayrollEmployeeTotalsColumn1').html();

												var sURL = document.location.protocol + '//' + document.location.host;
												var aHeaderHTML =
												[
													'<div style="margin-bottom:20px;">',
													'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
													'<div style="font-size:1.6em;">PAYROLL</div>',
												];

												aHeaderHTML.push('<div>');

												aHeaderHTML.push('<div>');

												if ($('#ns1blankspacePayrollStartDate').val() != '')
												{
													aHeaderHTML.push($('#ns1blankspacePayrollStartDate').val());
												}

												if ($('#ns1blankspacePayrollEndDate').val() != '')
												{
													aHeaderHTML.push(' to ' + $('#ns1blankspacePayrollEndDate').val());
												}

												aHeaderHTML.push('</div>');

												aHeaderHTML.push('</div><hr>');

												ns1blankspace.pdf.create(
												{
													xhtmlContent: aHeaderHTML.join('') + sHTML,
													filename: 'payroll.pdf',
													open: true,
													leftmargin: 45,
													topmargin: 1,
													headerheight: 15,
													footerheight: 15,
													baseURLBody: sURL,
													object: 12,
													objectContext: ns1blankspace.spaceContactBusiness
												});
											})
											.css('width', '90px');
										}	    	
									}
								},

					row: 		function (oRow, oParam)
								{
									var bShowAsList = ns1blankspace.util.getParam(oParam, 'showAsList', {"default": true}).value;
									var sChecked;

									var sKey = oRow.id;									
									var aHTML = [];

									var oPayRecord = $.grep(ns1blankspace.financial.payroll.data.payrecords.data.rows,
															function (payrecord) {return payrecord['payrecord.employee.contactperson'] == oRow['employee.contactperson']})[0];

									if (oPayRecord==undefined && oRow["employee.statustext"] == 'Inactive')
									{}
									else
									{		
										if (false && oPayRecord == undefined)
										{
											sChecked = ''
										}
										else
										{
											sChecked = ' checked="checked"'
										}

										aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollTotals_container-' + sKey + '">' +
																		'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollTotals_selectContainer-' + sKey + '">' +
																		'<input type="checkbox"' + sChecked + ' id="ns1blankspacePayrollTotals_select-' + sKey + '" /></td>');

										aHTML.push('<td id="ns1blankspacePayrollTotals_employee" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													(oRow["employee.contactperson.firstname"] != ''?'<div>' + oRow["employee.contactperson.firstname"] + '</div>':'') +
													'<div>' + oRow["employee.contactperson.surname"] + '</div>' +
													'<div class="ns1blankspaceSub">' + oRow["employee.employeenumber"] + '</div>' + 
													'</td>');

										if (bShowAsList)
										{	
											aHTML.push('<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["grosssalary"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["taxbeforerebate"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["taxadjustments"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["netsalary"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-':oPayRecord["superannuation"]) + '</td>' +
											 			'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="text-align:right; font-size:0.75em;">' +
											 					(oPayRecord==undefined?'-': oPayRecord["deductions"]) + '</td>');				
										}
										else
										{
											aHTML.push('<td id="ns1blankspacePayrollTotals_pay" class="ns1blankspaceRow ns1blankspaceSubNote" style="padding-bottom:6px;">')

											if (oPayRecord == undefined)
											{
												aHTML.push('<div class="ns1blankspaceSubNote">-<div>');
											}
											else
											{
												aHTML.push('<table>' +
															 '<tr><td class="ns1blankspaceRow">Gross</td><td class="ns1blankspaceRow"style="text-align:right;">$' + oPayRecord["grosssalary"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Tax</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["taxbeforerebate"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Tax Adjustments</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["taxadjustments"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Net</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["netsalary"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow">Superannuation</td><td class="ns1blankspaceRow" style="text-align:right;">$' + oPayRecord["superannuation"] + '</td></tr>' +
															 '<tr><td class="ns1blankspaceRow" style="border-width:0px;">Deductions</td><td class="ns1blankspaceRow" style="border-width:0px; text-align:right;">$' + oPayRecord["deductions"] + '</td></tr>' +
															 '</table>');
											}

											aHTML.push('</td>');
										}	
									
										aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
														'<span style="margin-right:5px;" id="ns1blankspacePayrollTotals_option_preview-' + sKey + '"' +
																		' class="ns1blankspaceRowPreview"></span>' +
														'</td></tr>');
										
										return aHTML.join('');
									}
								},

					bind: 		function ()
								{
									$('#ns1blankspacePayrollEmployeeTotals .ns1blankspaceRowSelect')
									.click(function()
									{
										$('#ns1blankspaceViewControlNew').button({disabled: false});
										ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
										ns1blankspace.financial.payroll.employees.show({filterEmployee: (this.id).split('-')[1]});	
									})
									.css('width', '15px')
									.css('height', '20px');

									$('.ns1blankspacePayrollEmployeeTotalsSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspacePayrollEmployeeTotals input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');		
								},

					preview: {
									init: 	function (oParam)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.totals.employees.preview.show);
													oParam = ns1blankspace.util.setParam(oParam, 'template', 'payroll');
													oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
													ns1blankspace.format.templates.init(oParam);
												},

									show:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;
													var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.payroll.data.startDate}).value;
													var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.payroll.data.endDate}).value;
													var bShow;

													if (oParam != undefined)
													{	
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
														if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
													}
													else
													{
														oParam = {}
													}			

													if (iStep == 1)
													{	
														ns1blankspace.financial.payroll.data.summaries = [];

														if ($('#ns1blankspacePayrollEmployeeTotals input:checked').length > 0)
														{	
															$('#ns1blankspacePayrollTotalsPreviewStatus').css('display', 'block').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
																		'<span id="ns1blankspacePayrollTotalsPreviewStatusIndex">1</span>/' + $('#ns1blankspacePayrollEmployeeTotals input:checked').length + 
																		'</span>');
														}
														else
														{
															ns1blankspace.status.error('No employees selected')
														}	

														$('#ns1blankspacePayrollEmployeeTotals input:checked').each(function() 
														{
															var sKey = (this.id).split('-')[1];

															var oData = $.grep(ns1blankspace.financial.payroll.data.employees, function (a) {return a.id == sKey;})[0]

															if (oData)
															{
																ns1blankspace.financial.payroll.data.summaries.push(oData);
															}
														});

														oParam.step = 2;
														ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
													}			

													if (iStep == 2)
													{
														if (iDataIndex < ns1blankspace.financial.payroll.data.summaries.length)
														{	
															$('#ns1blankspacePayrollTotalsPreviewStatusIndex').html(iDataIndex + 1);

															var oData = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

															if (oData.pay !== undefined)
															{
																oParam.step = 2;
																oParam.dataIndex = iDataIndex + 1;
																ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

																var oSearch = new AdvancedSearch();
																oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
																oSearch.addField('grosssalary,netsalary,deductions,allowances,superannuation,taxbeforerebate,taxadjustments,payrecord.payperiod.paydate');
																oSearch.addSummaryField('sum(grosssalary) grosssalary');
																oSearch.addSummaryField('sum(netsalary) netsalary');
																oSearch.addSummaryField('sum(superannuation) superannuation');
																oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
																oSearch.addSummaryField('sum(taxadjustments) taxadjustments');
																oSearch.addSummaryField('sum(allowances) allowances');
																oSearch.addSummaryField('sum(deductions) deductions');
																oSearch.addSummaryField('max(payrecord.payperiod.paydate) paydate');

																oSearch.addFilter('employee', 'EQUAL_TO', oData.id);

																if (sStartDate !== undefined)
																{
																	oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
																}
																	
																if (sEndDate != undefined)
																{
																	oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
																}

																oSearch.rows = 200;
																oSearch.sort('payrecord.payperiod.paydate', 'asc');

																oSearch.getResults(function(oResponse)
																{
																	oParam.step = 2;
																	oParam.dataIndex = iDataIndex + 1;

																	bShow = (oResponse.data.rows.length != 0)
																	if (bShow) {bShow = (parseFloat((oResponse.summary.grosssalary).parseCurrency()) != 0)}

																	if (bShow)
																	{	
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].pay = oResponse.data.rows;
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].grosssalary = (oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].netsalary = (oResponse.summary.netsalary).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].superannuation = (oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].taxbeforerebate = (oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].taxadjustments = (oResponse.summary.taxadjustments).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].allowances = (oResponse.summary.allowances).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].deductions = (oResponse.summary.deductions).parseCurrency().formatMoney(2, '.', ',');
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].contactbusinesstext = ns1blankspace.financial.payroll.data.summaries[iDataIndex]['employee.contactbusiness.tradename'];
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].year = Date.parse(oResponse.summary.paydate).getFullYear();
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].startdate = sStartDate;
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].enddate = sEndDate;
																		ns1blankspace.financial.payroll.data.summaries[iDataIndex].tax = numeral(numeral(oResponse.summary.taxbeforerebate).value() - numeral(oResponse.summary.taxadjustments).value()).format('(0,0.00)');

																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html('');
																		
																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).button(
																		{
																			text: false,
																			icons:
																			{
																				primary: "ui-icon-document"
																			}
																		})
																		.click(function()
																		{
																			oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
																			ns1blankspace.financial.payroll.totals.employees.preview.showHide(oParam);
																		})
																		.css('width', '15px')
																		.css('height', '20px');
																	}
																	else
																	{
																		$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).html('<span class="ns1blankspaceSubNote">None</span>');
																		$('#ns1blankspacePayrollTotals_select-' + oData.id).attr('checked', false);
																	}	

																	$('#ns1blankspacePayrollTotals_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');
																	ns1blankspace.financial.payroll.totals.employees.preview.show(oParam);
																});
															}					
														}
														else
														{
															$('#ns1blankspacePayrollTotalsPreviewStatus').css('display', 'none');
															ns1blankspace.util.onComplete(oParam);
														}	
													}						
												},

									showHide: 	function (oParam)
												{
													var sXHTMLElementID;
													var sKey;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspacePayrollTotals_container_preview-' + sKey).length != 0)
													{
														$('#ns1blankspacePayrollTotals_container_preview-' + sKey).remove();
													}
													else
													{
														var sHTML = 'No preview';

														var oSummary = $.grep(ns1blankspace.financial.payroll.data.summaries, function (a) {return a.id == sKey;})[0];

														if (oSummary)
														{
															var oTemplate = ns1blankspace.format.templates.get(oParam);

															if (oTemplate == undefined)
															{
																ns1blankspace.status.error('No pay summary template')
															}
															else
															{
																sHTML = ns1blankspace.format.render(
																{
																	object: 37,
																	objectContext: -1,
																	xhtmlTemplate: oTemplate.xhtml,
																	objectData: oSummary,
																	objectOtherData: oSummary.pay
																});

																oSummary.xhtml = sHTML;
															
																$('#ns1blankspacePayrollTotals_container-' + sKey).after('<tr id="ns1blankspacePayrollTotals_container_preview-' + sKey + '">' +
																'<td colspan=8><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>');
															}	
														}
													}
												}			
								},

					email: 	{
									init: 	function (oParam, oResponse)
												{
													ns1blankspace.financial.payroll.totals.employees.email.send({dataIndex: 0})
												},

									send:		function (oParam)
												{		
													var iDataIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
													}
													else
													{
														oParam = {}
													}			
																	
													if (iDataIndex < ns1blankspace.financial.payroll.data.summaries.length)
													{
														$('#ns1blankspacePayrollTotalsEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
															'<span id="ns1blankspacePayrollTotalsEmailStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.payroll.data.summaries.length + 
															'</span>');

														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.summaries[iDataIndex]);

														var oSummary = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

														if (oSummary !== undefined)
														{
															if (oSummary['employee.contactperson.email'] == '')
															{
																$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('No Email');
																oParam.dataIndex = iDataIndex + 1;
																oParam.step = 2;
																ns1blankspace.financial.payroll.totals.employees.email.send(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html(ns1blankspace.xhtml.loadingSmall);

																if (oSummary.xhtml === undefined)
																{
																	var oTemplate = ns1blankspace.format.templates.get({object: 37});

																	oSummary.xhtml = ns1blankspace.format.render(
																	{
																		object: 37,
																		objectContext: -1,
																		xhtmlTemplate: oTemplate.xhtml,
																		objectData: oSummary,
																		objectOtherData: oSummary.pay
																	});
																}

                                                                var fromemail = ns1blankspace.financial.data.settings.messagingaccounttext;
                                                                if (fromemail == '')
                                                                {
                                                                    fromemail = ns1blankspace.user.email;
                                                                }
                                                                
																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Summary',
																	message: oSummary.xhtml,
																	to: oSummary['employee.contactperson.email'],
																	object: 37,
																	objectContext: oSummary.id,
																	fromemail: fromemail
																}

																//

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function (data)
																	{
																		if (data.status == 'OK')
																		{
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('Emailed');
																			oParam.dataIndex = iDataIndex + 1;
																			oParam.step = 2;
																			ns1blankspace.financial.payroll.totals.employees.email.send(oParam);
																		}
																		else
																		{
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).html('Error');
																			$('#ns1blankspacePayrollTotals_selectContainer-' + oSummary.id).attr('title', data.error.errornotes);
																		}
																	}
																});
															}	
														}
													}
													else
													{
														$('#ns1blankspacePayrollTotalsEmailStatus').fadeOut(3000);
														ns1blankspace.util.onComplete(oParam);
													}	
												}																	
								},

					pdf: 		{
									process: function (oParam, oResponse)
												{
													oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.totals.employees.pdf.init};
													ns1blankspace.financial.payroll.totals.employees.preview.init(oParam);
												},

									init: 	function (oParam, oResponse)
												{
													ns1blankspace.financial.payroll.totals.employees.pdf.create({dataIndex: 0})
												},

									create:	function (oParam)
												{		
													var iDataIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
													}
													else
													{
														oParam = {}
													}			
																	
													if (iDataIndex < ns1blankspace.financial.payroll.data.summaries.length)
													{
														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.summaries[iDataIndex]);

														var oSummary = ns1blankspace.financial.payroll.data.summaries[iDataIndex];

														if (oSummary !== undefined)
														{
															if (oSummary.xhtml === undefined)
															{
																var oTemplate = ns1blankspace.format.templates.get({object: 37});

																oSummary.xhtml = ns1blankspace.format.render(
																{
																	object: 37,
																	objectContext: -1,
																	xhtmlTemplate: oTemplate.xhtml,
																	objectData: oSummary,
																	objectOtherData: oSummary.pay
																});
															}

															oParam.dataIndex = iDataIndex + 1;
															ns1blankspace.financial.payroll.totals.employees.pdf.create(oParam);
														}														
													}
													else
													{
														var sHTML = '<style>div.summary {font-size: 125%;} td {padding:8px;}</style>' +
																			_.join(_.map(ns1blankspace.financial.payroll.data.summaries, 'xhtml'), '<div style="page-break-after:always;"></div>');

														var sURL = document.location.protocol + '//' + document.location.host;

														ns1blankspace.pdf.create(
														{
															xhtmlContent: sHTML,
															filename: 'payroll-payment-summaries.pdf',
															open: true,
															leftmargin: 45,
															topmargin: 45,
															headerheight: 15,
															footerheight: 15,
															baseURLBody: sURL,
															object: 12,
															objectContext: ns1blankspace.spaceContactBusiness
														});
													}	
												}																	
								},			

					file: 	{
									init: 	function (oParam, oResponse)
												{
													if (oParam === undefined) {oParam = {fileMode: 'T'}}

													var oSearch = new AdvancedSearch();
													oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
													oSearch.addField('tradename,legalname,abn,phonenumber,faxnumber,email,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry' +
																			'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode');
													oSearch.rows = 1;
													oSearch.addFilter('id', 'EQUAL_TO', (ns1blankspace.spaceContactBusiness || ns1blankspace.user.contactBusiness))
													
													oSearch.getResults(function(oResponse)
													{
														if (oResponse.status == 'OK')
														{	
															var oRow =  oResponse.data.rows[0];

															oParam.name = 'Payment Summary - AU';
															oParam.saveToFile = true;
															oParam.xhtmlElementID = 'ns1blankspaceFileDownload';

															oParam.abn = (oRow.abn).replace(/\s/g,'');
															oParam.startDate = $('#ns1blankspacePayrollStartDate').val();
															oParam.endDate = $('#ns1blankspacePayrollEndDate').val();
															oParam.contactBusinessText = (oRow.tradname==''?oRow.legalname:oRow.tradename);
															oParam.tradeName = oRow.tradename;
															oParam.contactPersonText = ns1blankspace.user.commonName;
															oParam.legalName = oRow.legalname;
															oParam.phone = oRow.phonenumber;
															oParam.fax = oRow.faxnumber;
															oParam.email = oRow.email;
															oParam.streetAddress1 = oRow.streetaddress1;
															oParam.streetAddress2 = oRow.streetaddress2;
															oParam.streetSuburb = oRow.streetsuburb;
															oParam.streetState = oRow.streetstate;
															oParam.streetPostCode = oRow.streetpostcode;
															oParam.mailingAddress1 = oRow.mailingaddress1;
															oParam.mailingAddress2 = oRow.mailingaddress2;
															oParam.mailingSuburb = oRow.mailingsuburb;
															oParam.mailingState = oRow.mailingstate;
															oParam.mailingPostCode = oRow.mailingpostcode;

															oParam.fileMode = ns1blankspace.financial.payroll.totals.employees.file.data.fileMode;
															oParam.sample = ns1blankspace.financial.payroll.totals.employees.file.data.sample;
																
															ns1blankspace.financial.payroll.totals.employees.file.create(oParam);
														}	
													});	
												},

									create: 	function (oParam, oResponse)
												{
													if (ns1blankspace.financial.payroll.data.summaries.length == 0)
													{
														ns1blankspace.status.error('No employees selected');
													}	
													else
													{	
														ns1blankspace.status.working('Creating file...');

														var oItems = [];

														$.each(ns1blankspace.financial.payroll.data.summaries, function()
														{
															var oItem = _.clone(this);
															delete oItem.pay;
															oItems.push(oItem);
														});

														$('#ns1blankspacePayrollTotalsColumn2').html('<table class="ns1blankspace">' +
															'<tr>' +
															'<td class="ns1blankspaceTextMulti">' +
															'<div id="ns1blankspaceFileContents" class="ns1blankspaceTextMulti" style="background-color:#F3F3F3; width:100%; font-family:Courier New; font-size:0.865em; white-space:pre; overflow:auto;">' +
																'</div>' +
															'</td></tr>' +
															'<tr>' +
															'<td class="ns1blankspaceAction" id="ns1blankspaceFileDownload" style="padding-top:8px;"' +
															'</td></tr>' +
															'<tr>' +
															'<td class="ns1blankspace" id="ns1blankspaceFileSpecification" style="padding-top:8px;"' +
															'</td></tr></table>');		

														oParam.totalRows = oItems.length;
														oParam.items = oItems;
														oParam.fileName = 'atopsar.txt';

														if (oParam.sample)
														{
															oParam.saveToFile = false;
														}

														oParam.remote = true;
													
														var sFile = ns1blankspace.setup.file["export"].process(oParam);

														ns1blankspace.status.clear();

														if (oParam.sample)
														{
															ns1blankspace.financial.payroll.totals.employees.file.specification();
														}
														else
														{
															$('#ns1blankspaceFileContents').html(sFile);
														}
													}	
												},

									specification: function (oParam)
												{
													var aHTML = [];

													aHTML.push('<table class="ns1blankspace" style="width:550px;">')
													aHTML.push('<tr class="ns1blankspaceCaption">');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Start</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">End</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Text</td>');
													aHTML.push('<td class="ns1blankspaceHeaderCaption">Actual End</td>');
													aHTML.push('</tr>');

													$.each(ns1blankspace.setup.file.export._data.file, function (l, line)
													{
														sStyle = '';
														if (line.start == 1)
														{
															aHTML.push('<tr class="ns1blankspaceRow"><td colspan=4 style="background-color:#f5f5f5;"></td></tr>');
															sStyle = ' style="padding-top:8px;"'
														}

														aHTML.push('<tr class="ns1blankspaceRow">');
															
														aHTML.push('<td id="ns1blankspaceFileSpec_start-' + line.start + '" class="ns1blankspaceRow"' + sStyle + '>' +
																				line.start + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_end-' + line.start + '" class="ns1blankspaceRow"' + sStyle + '>' +
																				line.end + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_text-' + line.start + '" class="ns1blankspaceRow ns1blankspaceSub"' + sStyle + '>' +
																				line.text + '</td>');

														aHTML.push('<td id="ns1blankspaceFileSpec_textend-' + line.start + '" class="ns1blankspaceRow ns1blankspaceSub"' + sStyle + '>' +
																				line.textEnd + 
																				(line.end!=line.textEnd?' !!':'') + '</td>');
																						
														aHTML.push('</tr>');

													});

													aHTML.push('</table>');

													$('#ns1blankspaceFileSpecification').html(aHTML.join(''))
												}			
								},

					report: 	{
									//!!STP-START
									// 	1: https://sandbox.singletouch.com.au/Support/StpEventModel
                                    //  2: https://sandbox.singletouch.com.au/Support/StpEventModel2020

									data:
									{
										1:
                                        {
											urls:
											{
												production: 'https://api.singletouch.com.au/api/STPEvent2018',
												sandbox: 'https://sandbox-api.singletouch.com.au/api/STPEvent2018'
											},
											tenants:	
											{
												production: 'singletouch.onmicrosoft.com/b2c_1_singletouch',
												sandbox: 'singletouchsandbox.onmicrosoft.com/b2c_1_singletouch'
											},
											msals:	
											{
												production: 'https://msal.mydigitalstructure.cloud',
												sandbox: 'https://app-next.1blankspace.com/msal'
											},
                                            format:
                                            {
                                                header:
                                                {
                                                    mustBeSetDefault: true,
                                                    fields:
                                                    [
                                                        {
                                                            name: 'OrgName',
                                                            param: 'contactBusinessText'
                                                        },
                                                        {
                                                            name: 'OrgABN',
                                                            param: 'contactBusinessABN',
                                                            help: 'Set the ABN on the business contact for this space.',
                                                            caption: 'Entity ABN'
                                                        },
                                                        {
                                                            name: 'BranchID',
                                                            param: 'branchID',
                                                            caption: 'Branch ID',
                                                            help: 'The branch number of an organisation. ' +
																'Used for organisations that wish to sub-divide their activities in dealing with their tax obligations. ' +
																'It is used to identify the correct branch of an organisation for the PAYGW obligation. ' +
																'If the Payer does not have a branch number, this must be set to 1.'
                                                        },
                                                        {
                                                            name: 'BMSID',
                                                            value: 'mydigitalstructure',
                                                            caption: 'BMS ID',
                                                            help: 'This identifies the Business Management System software used by the employer. ' +
																	'This is allocated to each instance of a payroll solution and allows multiple payroll ' + 
																	'reports submitted separately to be allocated to the same payee. ' +
																	'It must be unique within an ABN/branch. ' +
																	'Once established for that payroll instance, it should not be changed without reference to the ' +
																	'STP Business Implementation Guide (BIG).'
                                                        },
                                                        {
                                                            name: 'PayrollGroupID',
                                                            param: 'payrollGroupID'
                                                        },
                                                        {
                                                            name: 'ProductID',
                                                            param: 'atoProductID',
                                                            caption: 'Product ID',
                                                            help: 'Software developers must obtain a Product ID from the ATO ' +
                                                            'If you are not a software developer leave this value blank.'
                                                        },
                                                        {
                                                            name: 'EventDate',
                                                            dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                            param: 'now',
                                                            help: 'Date on which a payment has been made by an entity. Example: "2018-03-31T00:00:00"',
                                                			spec: 'PAYEVNT 0002 2017/0003 2018: PaymentRecord.Transaction.Date'
                                                        },
                                                        {
                                                            name: 'PaymentDate',
                                                            param: 'payDate',
                                                            dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                            caption: 'Payment date'
                                                        },
                                                        {
                                                            name: 'PayrollTrxID',
                                                            param: 'guid'
                                                        },
                                                        {
                                                            name: 'IsUpdate',
                                                            param: 'isUpdate',
                                                            help: '"true" or "false". Signifies that the pay event submitted is an update event.'
                                                        },
                                                        {
                                                            name: 'IsFullFileReplacement',
                                                            param: 'isFull',
                                                            help: '"true" or "false". Signifies that the pay event submitted is a full file replacement.'
                                                        },
                                                        {
                                                            name: 'DeclarationAcceptedBy',
                                                            param: 'declarationAcceptedBy'
                                                        },
                                                        {
                                                            name: 'EmployerPeriodW1',
                                                            param: 'employerPeriodW1',
                                                            caption: 'Period W1 value'
                                                        },
                                                        {
                                                            name: 'EmployerPeriodW2',
                                                            param: 'employerPeriodW2',
                                                            caption: 'Period W2 value'
                                                        },
                                                        {
                                                            name: 'RegisteredAgentABN',
                                                            param: 'registeredAgentABN',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentNumber',
                                                            param: 'registeredAgentNumber',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentDecAcceptedBy',
                                                            param: 'registeredAgentDecAcceptedBy',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentEmail',
                                                            param: 'registeredAgentEmail',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentPhone',
                                                            param: 'registeredAgentPhone',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RecordID',
                                                            value: '0',
                                                            help: 'This should be 0.'
                                                        },
                                                        {
                                                            name: 'EventRecords',
                                                            value: [],
                                                            mustBeSet: false
                                                        }
                                                    ]
                                                },

                                                item:
                                                [
                                                    {
                                                        parentName: 'EventRecords',
                                                        mustBeSetDefault: true,
                                                        fields:
                                                        [
                                                            {
                                                                name: 'PayeePayrollID',
                                                                field: 'employee.employeenumber',
                                                                help: 'Set the Employee\'s Number.',
                                                                caption: 'Payroll number',
                                                                help: 'ID given to an employee (payee) in the payroll system identified by the BMSID provided',
                                                				spec: 'PAYEVNT 0002 2017/0003 2018: Identifiers.EmploymentPayrollNumber.Identifier'
                                                            },
                                                            {
                                                                name: 'PayeeTFN',
                                                                field: 'employee.taxfilenumber',
                                                                help: 'Set the Employee\'s Tax File Number.',
                                                                caption: 'Employee TFN',
                                                                numeric: true
                                                            },
                                                            {
                                                                name: 'ContractorABN',
                                                                value: '',
                                                                help: 'If employee (payee) is a contractor, the ABN of the contractor must be supplied',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeFamilyName',
                                                                field: 'employee.contactperson.surname',
                                                                help: 'Set the Employee\'s Surname.',
                                                                caption: 'Family name'
                                                            },
                                                            {
                                                                name: 'PayeeFirstName',
                                                                field: 'employee.contactperson.firstname',
                                                                help: 'Set the Employee\'s First Name.',
                                                                caption: 'Given name'
                                                            },
                                                            {
                                                                name: 'PayeeOtherName',
                                                                value: '',
                                                                mustBeSet: false,
                                                                caption: 'Middle name'
                                                            },
                                                            {
                                                                name: 'PayeeDateOfBirth',
                                                                field: 'employee.contactperson.dateofbirth',
                                                                help: 'Set the Employee\'s Date of Birth.',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Date of birth'
                                                            },
                                                            {
                                                                name: 'PayeeCommencementDate',
                                                                field: 'employee.employmentstartdate',
                                                                help: 'This is the Employee\'s Start Date.',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Hired date'
                                                            },
                                                            {
                                                                name: 'PayeeCessationDate',
                                                                field: 'employee.employmentenddate',
                                                                mustBeSet: false,
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Termination date'
                                                            },
                                                            {
                                                                name: 'PayeeAddressLine1',
                                                                field: 'employee.contactperson.streetaddress1',
                                                                help: 'Set the Employee\'s Street Address.',
                                                                caption: 'Address 1'
                                                            },
                                                            {
                                                                name: 'PayeeAddressLine2',
                                                                field: 'employee.contactperson.streetaddress2',
                                                                mustBeSet: false,
                                                                caption: 'Address 2'
                                                            },
                                                            {
                                                                name: 'PayeeSuburb',
                                                                field: 'employee.contactperson.streetsuburb',
                                                                help: 'Set the Employee\'s Suburb.',
                                                                caption: 'Suburb'
                                                            },
                                                            {
                                                                name: 'PayeeState',
                                                                field: 'employee.contactperson.streetstate',
                                                                help: 'Set the Employee\'s State; "AAT", "ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC" or "WA"',
                                                                caption: 'State/territory'
                                                            },
                                                            {
                                                                name: 'PayeePostcode',
                                                                field: 'employee.contactperson.streetpostcode',
                                                                help: 'Set the Employee\'s Post Code.',
                                                                caption: 'Postcode'
                                                            },
                                                            {
                                                                name: 'PayeeCountry',
                                                                value: '',
                                                                caption: 'Country',
																mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeEmail',
                                                                field: 'employee.contactperson.email',
                                                                help: 'Set the Employee\'s Email Address.',
                                                                caption: 'Email',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeePhone',
                                                                field: 'employee.contactperson.mobile',
                                                                help: 'Set the Employee\'s Mobile Phone Number.',
                                                                caption: 'Phone',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PeriodStartDate',
                                                                field: 'startdate',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Pay period start date'
                                                            },
                                                            {
                                                                name: 'PeriodEndDate',
                                                                field: 'enddate',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Pay period end date'
                                                            },
                                                            {
                                                                name: 'FinalEventIndicator',
                                                                param: 'isFinalForYear',
                                                                defaultValue: 'false',
                                                                caption: 'Final EOY pay indicator'
                                                            },
                                                            {
                                                                name: 'PayeeGrossPayments',
                                                                field: 'grosssalary',
                                                                mustBeSet: false,
                                                                currency: true,
                                                                caption: 'Employee gross pay'
                                                            },
                                                            {
                                                                name: 'PayeeCDEPPaymentAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true,
                                                                caption: 'Employee CDEP',
                                                                help: 'Payee CDEP Payment Amount',
                                                				spec: 'PAYEVNT 0002 2017/0003 2018: Remuneration.IndividualNonBusinessCommunityDevelopmentEmploymentProject.Amount'
                                                            },
                                                            {
                                                                name: 'PayeeTotalINBPAYGWAmount',
                                                                _field: 'taxbeforerebate',
                                                                field: 'tax',
                                                                mustBeSet: true,
                                                                currency: true,
                                                                caption: 'Employee tax'
                                                            },
                                                            {
                                                                name: 'PayeeExemptForeignIncomeAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true,
                                                                caption: 'Foreign income',
                                                                help: 'Payee Exempt Foreign Income Amount',
                                               					spec: 'PAYEVNT 0002 2017/0003 2018: Remuneration.IndividualNonBusinessExemptForeignEmploymentIncome.Amount'
                                                            },
                                                            {
                                                                name: 'SuperGuaranteeAmount',
                                                                field: 'superannuation',
                                                                currency: true,
                                                                caption: 'Super guarantee amount'
                                                            },
                                                            {
                                                                name: 'OTEAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true,
                                                                help: 'This is the value, during the relevant period, for what an individual has earned ' +
																		'during their ordinary hours of work.' +
																		'Note: You must provide a value for either "OTEAmount" or "SuperGuaranteeAmount"' +
																		'or both (recommended).',
																spec: 'PAYEVNT 0002 2017/0003 2018: Remuneration.OrdinaryTimeEarnings.Amount'
                                                            },
                                                            {
                                                                name: 'ReportableEmployerSuperContribution',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true,
                                                                caption: 'Reportable Employer Super Contribution (RESC)',
                                                                help: 'This is the value, during the relevant period, for employer superannuation contributions ' +
																		'that are additional to the compulsory contributions where the employee influenced ' +
																		'the rate or amount of contribution.',
																spec: 'PAYEVNT 0002 2017/0003 2018: SuperannuationContribution.EmployerReportable.Amount'
                                                            },
                                                            {
                                                                name: 'PayeeLumpSumPaymentAType',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeLumpSumPaymentA',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeLumpSumPaymentB',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeLumpSumPaymentD',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeLumpSumPaymentE',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeRFBTaxableAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeRFBTaxableAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeRFBExemptAmount',
                                                                value: '',
                                                                mustBeSet: false,
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeResidencyStatus',
                                                                value: 'Resident',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeTaxFreeThresholdClaimed',
                                                                field: 'employee.taxfreethreshold',
                                                                caption: 'Claiming threshold indicator',
                                                                defaultValue: 'false',
                                                                help: ''
                                                            },
                                                            {
                                                                name: 'PayeeHELPIndicator',
                                                                field: 'employee.deducthelp',
                                                                defaultValue: 'false',
                                                                caption: 'HELP inductor'
                                                            },
                                                            {
                                                                name: 'PayeeTradeSupportLoanIndicator',
                                                                value: 'false',
                                                                caption: 'TSL indicator' 
                                                            },
                                                            {
                                                                name: 'PayeeStudentLoanIndicator',
                                                                value: 'false',
                                                                caption: 'SFSS indicator'
                                                            },
                                                            {
                                                                name: 'PayeeDeclarerIdentifier',
                                                                value: '',
                                                                mustBeSet: false,
                                                                caption: 'Signed by'
                                                            },
                                                            {
                                                                name: 'PayeeDeclarationDate',
                                                                field: 'employee.employmentstartdate',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Signature date'
                                                            },
                                                            {
                                                                name: 'PayeeDeclarationAcceptanceIndicator',
                                                                value: 'true',
                                                                caption: 'TFN Accepted'
                                                            },
                                                            {
                                                                name: 'PayeeAllowancesDescription',
                                                                value: 'General',
                                                                mustBeSet: false,
                                                                caption: 'Other allowance 1 description'
                                                            },
                                                            {
                                                                name: 'PayeeAllowancesValue',
                                                                field: 'allowances',
                                                                mustBeSet: false,
                                                                caption: 'Other allowance 1 value',
                                                                currency: true
                                                            },
                                                            {
                                                                name: 'PayeeDeductionsFees',
                                                                field: 'deductions',
                                                                mustBeSet: false,
                                                                caption: 'Union fees',
                                                                currency: true
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        },
                                        2: 
                                        {
											urls:
											{
												production: 'https://api.singletouch.com.au/api/STPEvent2020',
												sandbox: 'https://sandbox-api.singletouch.com.au/api/STPEvent2020'
											},
											tenants:	
											{
												production: 'singletouch.onmicrosoft.com/b2c_1_singletouch',
												sandbox: 'singletouchsandbox.onmicrosoft.com/b2c_1_singletouch'
											},
											msals:	
											{
												production: 'https://msal.mydigitalstructure.cloud',
												sandbox: 'https://app-next.1blankspace.com/msal'
											},
                                            format:
                                            {
                                                header:
                                                {
                                                    mustBeSetDefault: true,
                                                    fields:
                                                    [
                                                        {
                                                            name: 'OrgName',
                                                            param: 'contactBusinessText'
                                                        },
                                                        {
                                                            name: 'OrgABN',
                                                            param: 'contactBusinessABN',
                                                            help: 'Set the ABN on the business contact for this space.',
                                                            caption: 'Entity ABN'
                                                        },
                                                        {
                                                            name: 'OrgWPN',
                                                            value: '',
                                                            help: 'The WPN (if applicable) of the organisation reporting STP data. This should only be used if there is no ABN.',
                                                            caption: 'Entity WPN (If no ABN)',
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'BranchID',
                                                            param: 'branchID',
                                                            caption: 'Branch ID',
                                                            help: 'The branch number of an organisation. ' +
                                                                    'Used for organisations that wish to sub-divide their activities in dealing with their tax obligations. ' +
                                                                    'It is used to identify the correct branch of an organisation for the PAYGW obligation. ' +
                                                                    'If the Payer does not have a branch number, this must be set to 1.'
                                                        },
                                                        {
                                                            name: 'BMSID',
                                                            value: 'mydigtalstructure-2',
                                                            caption: 'BMS ID',
                                                            help: 'This identifies the Business Management System software used by the employer. ' +
                                                                'This is allocated to each instance of a payroll solution and allows multiple payroll ' + 
                                                                'reports submitted separately to be allocated to the same payee. ' +
                                                                'It must be unique within an ABN/branch. ' +
                                                                'Once established for that payroll instance, it should not be changed without reference to the ' +
                                                                'STP Business Implementation Guide (BIG).'
                                                        },
                                                        {
                                                            name: 'PreviousBMSID',
                                                            value: '',
                                                            caption: 'Previous BMS ID',
                                                            help: 'Used if your software has (for some reason) changed BMS IDs. This should almost never happen.',
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'PayrollGroupID',
                                                            param: 'payrollGroupID'
                                                        },
                                                        {
                                                            name: 'ProductID',
                                                            param: 'atoProductID',
                                                            caption: 'Product ID',
                                                            help: 'Software developers must obtain a Product ID from the ATO ' +
                                                                'If you are not a software developer leave this value blank.'
                                                        },
                                                        {
                                                            name: 'EventDate',
                                                            dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                            param: 'now',
                                                            help: 'Date on which a payment has been made by an entity. Example: "2018-03-31T00:00:00"',
                                                            spec: 'PAYEVNT 0002 2017/0003 2018: PaymentRecord.Transaction.Date'
                                                        },
                                                        {
                                                            name: 'PaymentDate',
                                                            param: 'payDate',
                                                            dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                            caption: 'Payment date'
                                                        },
                                                        {
                                                            name: 'PayrollTrxID',
                                                            param: 'guid'
                                                        },
                                                        {
                                                            name: 'IsUpdate',
                                                            param: 'isUpdate',
                                                            help: '"true" or "false". Signifies that the pay event submitted is an update event.'
                                                        },
                                                        {
                                                            name: 'IsFullFileReplacement',
                                                            param: 'isFull',
                                                            help: '"true" or "false". Signifies that the pay event submitted is a full file replacement.'
                                                        },
                                                        {
                                                            name: 'DeclarationAcceptedBy',
                                                            param: 'declarationAcceptedBy'
                                                        },
                                                        {
                                                            name: 'EmployerPeriodW1',
                                                            param: 'employerPeriodW1',
                                                            caption: 'Period W1 value'
                                                        },
                                                        {
                                                            name: 'EmployerPeriodW2',
                                                            param: 'employerPeriodW2',
                                                            caption: 'Period W2 value'
                                                        },
                                                        {
                                                            name: 'RegisteredAgentABN',
                                                            param: 'registeredAgentABN',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentNumber',
                                                            param: 'registeredAgentNumber',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentDecAcceptedBy',
                                                            param: 'registeredAgentDecAcceptedBy',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentEmail',
                                                            param: 'registeredAgentEmail',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RegisteredAgentPhone',
                                                            param: 'registeredAgentPhone',
                                                            onlyIfData: true,
                                                            mustBeSet: false
                                                        },
                                                        {
                                                            name: 'RecordID',
                                                            value: '0',
                                                            help: 'This should be 0.'
                                                        },
                                                        {
                                                            name: 'RunDateTimeStamp',
                                                            param: 'paydate',
															dateAdd: {duration: -2, unit: 'day'},
															dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
															dateUTC: true,
                                                            help: 'The date (and time) that this pay event was processed (within your payroll system).',
															spec: 'https://developer.sbr.gov.au/collaborate/display/DSD/STP02+Key+Dates+Guidance+Note?preview=/169346046/221052989/ATO%20STP%20Phase%202%20-%20Key%20Dates%20Guidance%20Note%20V1.1.pdf'
                                                        },
                                                        {
                                                            name: 'PayUpdateDate',
                                                            param: 'paydate',
															dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                            help: 'The date the payment (monies) are to be paid to the employees.'
                                                        },
                                                        {
                                                            name: 'EventRecords',
                                                            value: [],
                                                            mustBeSet: false
                                                        }
                                                    ]
                                                },

                                                item:
                                                [
                                                    {
                                                        parentName: 'EventRecords',
                                                        mustBeSetDefault: true,
                                                        fields:
                                                        [
                                                            {
                                                                name: 'PayeePayrollID',
                                                                field: 'employee.employeenumber',
                                                                help: 'Set the Employee\'s Number.',
                                                                caption: 'Payroll number',
                                                                help: 'ID given to an employee (payee) in the payroll system identified by the BMSID provided',
                                                                spec: 'PAYEVNT 0002 2017/0003 2018: Identifiers.EmploymentPayrollNumber.Identifier'
                                                            },
                                                            {
                                                                name: 'PayeeTFN',
                                                                field: 'employee.taxfilenumber',
                                                                help: 'Set the Employee\'s Tax File Number.',
                                                                caption: 'Employee TFN',
                                                                numeric: true
                                                            },
                                                            {
                                                                name: 'ContractorABN',
                                                                value: '',
                                                                help: 'If employee (payee) is a contractor, the ABN of the contractor must be supplied',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeFamilyName',
                                                                field: 'employee.contactperson.surname',
                                                                help: 'Set the Employee\'s Surname.',
                                                                caption: 'Family name'
                                                            },
                                                            {
                                                                name: 'PayeeFirstName',
                                                                field: 'employee.contactperson.firstname',
                                                                help: 'Set the Employee\'s First Name.',
                                                                caption: 'Given name'
                                                            },
                                                            {
                                                                name: 'PayeeOtherName',
                                                                value: '',
                                                                mustBeSet: false,
                                                                caption: 'Middle name'
                                                            },
                                                            {
                                                                name: 'PayeeDateOfBirth',
                                                                field: 'employee.contactperson.dateofbirth',
                                                                help: 'Set the Employee\'s Date of Birth.',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Date of birth'
                                                            },
                                                        
                                                            {
                                                                name: 'PayeeAddressLine1',
                                                                field: 'employee.contactperson.streetaddress1',
                                                                help: 'Set the Employee\'s Street Address.',
                                                                caption: 'Address 1'
                                                            },
                                                            {
                                                                name: 'PayeeAddressLine2',
                                                                field: 'employee.contactperson.streetaddress2',
                                                                mustBeSet: false,
                                                                caption: 'Address 2'
                                                            },
                                                            {
                                                                name: 'PayeeSuburb',
                                                                field: 'employee.contactperson.streetsuburb',
                                                                help: 'Set the Employee\'s Suburb.',
                                                                caption: 'Suburb'
                                                            },
                                                            {
                                                                name: 'PayeeState',
                                                                field: 'employee.contactperson.streetstate',
                                                                help: 'Set the Employee\'s State; "AAT", "ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC" or "WA"',
                                                                caption: 'State/territory'
                                                            },
                                                            {
                                                                name: 'PayeePostcode',
                                                                field: 'employee.contactperson.streetpostcode',
                                                                help: 'Set the Employee\'s Post Code.',
                                                                caption: 'Postcode'
                                                            },
                                                            {
                                                                name: 'PayeeCountry',
                                                                value: '',
                                                                caption: 'Country',
																mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeEmail',
                                                                field: 'employee.contactperson.email',
                                                                help: 'Set the Employee\'s Email Address.',
                                                                caption: 'Email',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeePhone',
                                                                field: 'employee.contactperson.mobile',
                                                                help: 'Set the Employee\'s Mobile Phone Number.',
                                                                caption: 'Phone',
                                                                mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PayeeCommencementDate',
                                                                field: 'employee.employmentstartdate',
                                                                help: 'This is the Employee\'s Start Date.',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Hired date'
                                                            },
                                                            {
                                                                name: 'PayeeCessationDate',
                                                                field: 'employee.employmentenddate',
                                                                mustBeSet: false,
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Termination date'
                                                            },
                                                            {
                                                                name: 'PeriodStartDate',
                                                                field: 'startdate',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Pay period start date'
                                                            },
                                                            {
                                                                name: 'PeriodEndDate',
                                                                field: 'enddate',
                                                                dateFormat: 'YYYY-MM-DDTHH:mm:ss',
                                                                caption: 'Pay period end date'
                                                            },
                                                            {
                                                                name: 'FinalEventIndicator',
                                                                param: 'isFinalForYear',
                                                                defaultValue: 'false',
                                                                caption: 'Final EOY pay indicator'
                                                            },
                                                            {
                                                                name: 'EmploymentBasisCode',
                                                                field: 'employee.statustext',
                                                                mustBeSet: true,
                                                                caption: 'Employment Basis',
                                                                help: 'Indicates whether this employee is full-time, part-time, casual, etc. [F/P/C/L/V/D/N]',
																mappings:
																{
																	'Active': 'F',
																	'Non Active': 'N',
																	'Full Time': 'F',
																	'Part Time': 'P',
																	'Casual': 'C',
																	'Labour Hire': 'L',
																	'Volunteer': 'V', 
																	'Death Beneficiary': 'D',
																	'Terminated': 'N'
																}
                                                            },
                                                            {
                                                                name: 'CessationTypeCode',
                                                                field: 'employee.terminationtypetext',
                                                                mustBeSet: false,
                                                                caption: 'Cessation Type',
                                                                help: 'Describes the type of termination this employee is subject to i.e. redundancy, death, etc. [V/I/D/R/F/C/T]',
																mappings:
																{
																	'[N/A]': '',
																	'Voluntary': 'V',
																	'Ill Health': 'I',
																	'Deceased': 'D',
																	'Redundancy': 'R',
																	'Dismissal': 'D',
																	'Contract Ended': 'C',
																	'Transfer': 'T'
																}
                                                            },
                                                            {
                                                                name: 'TaxTreatmentCode',
                                                                field: 'employee.taxtreatmentcode',
																defaultValue: 'RTXXXX',
                                                                mustBeSet: true,
                                                                caption: 'Tax Treatment',
                                                                help: 'Indicates the PAYGW tax scales and other components that have been applied by the payer to determine payee withholding amounts. Must be included in every pay event.',
																url: 'https://developer.sbr.gov.au/collaborate/display/DSD/Tax+Treatment+Position+Paper?preview=/169346060/176422925/ATO%20STP%20Phase%202%20Tax%20Treatment%20Position%20Paper%20V1.1.pdf'
                                                            },
                                                            {
                                                                name: 'TaxOffsetAmount',
                                                                value: '0',
                                                                mustBeSet: true,
                                                                caption: 'Tax Offset Amount',
                                                                help: 'The annual tax offset amount that some payees may provide to their payers to reduce the amount of withholding, when specific criteria or concessions apply. For example, invalid or invalid carer tax offset; or zone or overseas forces tax offset.'
                                                            },
                                                            {
                                                                name: 'IncomeStreams',
																caption: 'Income Streams',
                                                                value: [],
                                                                mustBeSet: true,
                                                                help: 'Contains the pay values for the employee.'
                                                            },
                                                            {
                                                                name: 'PayeeDeductions',
																caption: 'Payee Deductions',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'Contains any reportable deductions for the employee.'
                                                            },
                                                            {
                                                                name: 'SuperEntitlements',
																caption: 'Super Entitlements',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'Contains any reportable superannuation entitlements for the employee.'
                                                            },
                                                            {
                                                                name: 'ReportableFringeBenefits',
																caption: 'Reportable Fringe Benefits',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'Contains any reportable fringe benefits for the employee.'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'IncomeStreams',
                                                        mustBeSetDefault: true,
														specURI: 'https://sandbox.singletouch.com.au/Support/IncomeStreamItem',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'IncomeStreamTypeCode',
                                                                summary: 'employee.incometypecode',
																defaultValue: 'SAW',
                                                                caption: 'Income Stream Type',
                                                                help: 'The type of withholding payment that is being reported. i.e. SAW for Salary and Wages & CHP for Closely Held Payees',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'IncomeStreamCountryCode',
                                                                value: '',
                                                                caption: 'Income Stream Country',
                                                                help: 'This represents the Country Code as prescribed by AS4590 and inherited from ISO 3166. Where income involves other tax jurisdictions, the income must be provided for the specific country for that tax jurisdiction. Australia has tax treaties with many countries to reduce or eliminate double taxation caused by overlapping tax jurisdictions. Refer to the BIG for more details.',
                                                                spec: '',
																mustBeSet: false
                                                            },
                                                            {
                                                                name: 'PAYGWAmount',
                                                                summary: 'taxbeforerebate',
                                                                caption: 'PAYGW Amount',
                                                                help: 'The --year-to-date-- amount withheld under the Pay As You Go (PAYG) arrangement.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'ForeignTaxPaidAmount',
                                                                value: '0',
                                                                caption: 'Foreign Tax Paid Amount',
                                                                help: 'The --year-to-date-- amount of foreign tax withheld.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'ExemptForeignIncomeAmount',
                                                                value: '0',
                                                                caption: 'Exempt Foreign Income Amount',
                                                                help: 'The --year-to-date-- amount of foreign employment income exempt from income tax in Australia.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'GrossAmount',
                                                                summary: 'grosssalary',
                                                                caption: 'Gross Amount',
                                                                help: 'The --year-to-date-- gross remuneration amount less other amounts reported elsewhere.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'OvertimeAmount',
                                                                value: '0',
                                                                caption: 'Overtime Amount',
                                                                help: 'The --year-to-date-- gross overtime amount.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'BonusesandCommissionsAmount',
                                                                value: '0',
                                                                caption: 'Bonuses and Commissions Amount',
                                                                help: 'The --year-to-date-- gross bonuses and commissions amount.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'DirectorsFeesAmount',
                                                                value: '0',
                                                                caption: 'Directors Fees Amount',
                                                                help: 'The --year-to-date-- directors fees amount.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'CDEPAmount',
                                                                value: '0',
                                                                caption: 'CDEP Amount',
                                                                help: 'The --year-to-date-- amount of payments made under a Community Development Employment Project (CDEP) scheme.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'PaidLeave',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'A tuple of various paid leave components.'
                                                            },
                                                            {
                                                                name: 'PayeeAllowances',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'A tuple of various allowance components.'
                                                            },
                                                            {
                                                                name: 'SalarySacrifice',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'A tuple of various salary sacrifice components.'
                                                            },
                                                            {
                                                                name: 'LumpSumPayments',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'A tuple of various lump sum components.'
                                                            },
                                                            {
                                                                name: 'TerminationPayments',
                                                                value: [],
                                                                mustBeSet: false,
                                                                help: 'A tuple of various ETP components.'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'PaidLeave',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/PaidLeaveItem',
														source: '_leave',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                value: 'O',
                                                                caption: 'Paid Leave Type',
                                                                help: 'The type code for leave item [C/U/P/W/A/O] [Detail O,Other Paid Leave].',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Paid Leave Amount',
                                                                help: 'The --year-to-date-- amount for the particular leave type.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'PayeeAllowances',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/AllowanceItem',
														source: '_allowances',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                source: 'code',
                                                                caption: 'Allowance Type',
                                                                help: 'The type code for the allowance item [CD/AD/LD/MD/RD/TD/KN/QN/OD].',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'AllowanceDescription',
                                                                value: 'Standard',
                                                                caption: 'Allowance Description',
                                                                help: 'This is the description or justification of the type of allowance paid to an individual that is not classified elsewhere. [ND: NON-DECUCTIBLE/U1: UNIFORM/V1: PRIVATE VEHICLE/H1: HOME OFFICE/T1: TRANSPORT/FARES/G1: GENERAL/Jobkeeper & Jobmaker as is].  When reporting other allowances, report the code as above + the pay component description. Example: "ND Cents pr km Home Office.',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Allowance Amount',
                                                                help: 'The --year-to-date-- amount for the particular allowance type.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'SalarySacrifice',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/SalarySacrificeItem',
														source: '_salarysacrifice',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                source: 'code',
                                                                caption: 'SalarySacrifice Type',
                                                                help: 'The type code for fringe benefit item [S/O].',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Salary Sacrifice Amount',
                                                                help: 'The --year-to-date-- amount for the particular salary sacrifice item.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'LumpSumPayments',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/LumpSumItem',
														source: '_lumpsum',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                field: 'x',
                                                                caption: 'Lump Sum Payment Type',
                                                                help: '"The type code for the lump sum item. [R/T/B/D/E/W]',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                field: 'x',
                                                                caption: 'Lump Sum Payment Amount',
                                                                help: 'The --year-to-date-- amount for the particular lump sum type.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'LumpSum_E_FinancialYear',
                                                                field: 'x',
                                                                caption: 'Lump Sum E Financial Year',
                                                                help: 'The financial year in which the Lump Sum E amount is to be distributed. Should only be supplied if the Type provided is "E".',
                                                                spec: ''
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'TerminationPayments',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/TerminationPaymentItem',
														source: '_termination',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'ETPCode',
                                                                value: 'O',
                                                                caption: 'ETP Code',
                                                                help: 'The ETP code of the termination payment item. [R/O/S/P/D/N/B/T] [Default 0,Other Reason]',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'PayeeETPPaymentDate',
                                                                summary: 'enddate',
                                                                caption: 'Payee ETP Payment Date',
                                                                help: 'This is the date when the employment termination payment was made to the employee.',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'PayeeTerminationPaymentTaxFreeComponent',
                                                                value: '0',
                                                                caption: 'Payee Termination Payment Tax Free Component',
                                                                help: 'This is the value, during the relevant period, for the tax free component of the Employment Termination Payment (ETP)',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'PayeeTerminationTaxableComponent',
                                                                value: '0',
                                                                caption: 'PayeeTerminationTaxableComponent',
                                                                help: 'This is the value, during the relevant period, for the taxable component of an individual\'s employment termination payment.',
                                                                spec: '',
																currency: true
                                                            },
                                                            {
                                                                name: 'PayeeTotalETPPAYGWAmount',
                                                                source: 'total',
                                                                caption: 'PayeeTotalETPPAYGWAmount',
                                                                help: 'This is the value, during the relevant period, for the amount withheld from the Employment Termination Payment (ETP) as Pay As You Go (PAYG) withholding.',
                                                                spec: '',
																currency: true
                                                            },
                                                        
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'PayeeDeductions',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/DeductionItem',
                                                        source: '_deductions',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                source: 'code',
                                                                caption: 'Type',
                                                                help: 'The type code for the deduction item. [F/W/G/D]',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Amount',
                                                                help: 'The --year-to-date-- amount for the particular deduction type.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'SuperEntitlements',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/SuperEntitlementsItem',
														source: '_superannuation',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                source: 'type',
                                                                caption: 'Type',
                                                                help: 'The type code for fringe benefit item. [L/O/R]',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Amount',
                                                                help: 'The --year-to-date-- amount for the particular super entitlement item.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        parentName: 'ReportableFringeBenefits',
                                                        mustBeSetDefault: true,
                                                        specURI: 'https://sandbox.singletouch.com.au/Support/ReportableFringeBenefitsItem',
														source: '_fringebenefits',
                                                        fields:
                                                        [
                                                            {
                                                                name: 'Type',
                                                                source: 'type',
                                                                caption: 'Type',
                                                                help: 'The type code for fringe benefit item. [T/X]',
                                                                spec: ''
                                                            },
                                                            {
                                                                name: 'Amount',
                                                                source: 'total',
                                                                caption: 'Amount',
                                                                help: 'The --year-to-date-- amount for the particular fringe benefits item.',
                                                                spec: '',
																currency: true
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
									},

									init: function (oParam)
									{
										oParam.onComplete = ns1blankspace.financial.payroll.totals.employees.report._init;
										ns1blankspace.financial.payroll.totals.employees.report.history.actions(oParam)
									},
										
									_init: function (oParam, oResponse)
									{
										$('#ns1blankspacePayrollEmployeeTotalsColumn2').html('').css('width', '0px');
										$('#ns1blankspacePayrollEmployeeTotalsColumn1').html(ns1blankspace.xhtml.loading);
										
										//singletouch.com.au Sandbox Client ID: "8d7e6f25-2c6e-44ee-a65a-e9b9c12f5fc0"
										//https://sandbox.singletouch.com.au/Support/StpEventModel

										var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod').value;
										var iBranchID = ns1blankspace.util.getParam(oParam, 'branchID', {"default": '1'}).value;
										var sATOProductID = ns1blankspace.util.getParam(oParam, 'atoProductID').value;
										var sPayrollGroupID = ns1blankspace.util.getParam(oParam, 'payrollGroupID', {"default": '1'}).value;
										var sIsUpdate = ns1blankspace.util.getParam(oParam, 'isUpdate').value;
										var sIsFull = ns1blankspace.util.getParam(oParam, 'isFull').value;
										var sDeclarationAcceptedBy = ns1blankspace.util.getParam(oParam, 'declarationAcceptedBy', {"default": ns1blankspace.user.email}).value;
										var sIsFinalForYear = ns1blankspace.util.getParam(oParam, 'isFinalForYear', {"default": ns1blankspace.financial.payroll.data.isFinalForYear}).value;

										if (sATOProductID == undefined)
										{
											sATOProductID = (ns1blankspace.session.labInstance?'10594':'71935') //582695
										}

										if (iPayPeriod == undefined)
										{
											iPayPeriod = ns1blankspace.financial.payroll.data.payPeriodID
										}

										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CONTACT_BUSINESS_SEARCH';		
											oSearch.addField('tradename,legalname,abn,phonenumber,faxnumber,email,streetaddress1,streetaddress2,streetsuburb,' +
																	'streetstate,streetpostcode,' +
																	'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode');
											oSearch.rows = 1;
											oSearch.addFilter('id', 'EQUAL_TO', (ns1blankspace.spaceContactBusiness || ns1blankspace.user.contactBusiness))
											
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.payroll.totals.employees.report._init(oParam, data)
											});
										}
										else
										{
											if (oResponse.data.rows.length == 0)
											{
												ns1blankspace.status.error('Cannot find space contact business.')
											}
											else
											{
												ns1blankspace.financial.payroll.data.contactBusiness = oResponse.data.rows[0];

												var oData = ns1blankspace.financial.payroll.data;
												var aActions = $.grep(ns1blankspace.financial.payroll.totals.employees.report.history.data.actions, function (action) {return action.objectcontext == iPayPeriod})

												if (sIsUpdate == undefined)
												{
													sIsUpdate = (aActions.length == 0?'false':'true')
												}

												if (sIsFull == undefined)
												{
													sIsFull = (aActions.length == 0?'false':'true')
												}

												if (oParam == undefined) {oParam = {}}

												var sBusinessName = oData.contactBusiness.legalname;
												if (sBusinessName == '') {sBusinessName = oData.contactBusiness.tradename}

												ns1blankspace.financial.payroll.totals.employees.report.history.data.actions

												$.extend(true, oParam,
												{
													contactBusinessText: sBusinessName,
													contactBusinessABN: (oData.contactBusiness.abn).replace(/\s/g,''),
													payDate: oData.endDate,
													atoProductID: sATOProductID,
													guid: oData.contactBusiness.abn + '-' + iBranchID,
													now: moment().format('DD MMM YYYY HH:mm:ss'),
													branchID: iBranchID,
													payrollGroupID: sPayrollGroupID,
													isUpdate: sIsUpdate,
													isFull: sIsFull,
													declarationAcceptedBy: sDeclarationAcceptedBy,
													endDate: oData.endDate,
													startDate: oData.startDate,
													isFinalForYear: sIsFinalForYear
												});

												if (ns1blankspace.option.financialRegisteredAgent != undefined)
												{
													$.extend(true, oParam, ns1blankspace.option.financialRegisteredAgent)
												}

												if (iPayPeriod == undefined)
												{
													ns1blankspace.financial.payroll.totals.employees.report.create(oParam);
												}
												else
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
													oSearch.addField('startdate,paydate,statustext,status,notes,modifieddate,frequency,frequencytext');
													oSearch.addFilter('id', 'EQUAL_TO', iPayPeriod);
													
													oSearch.getResults(function(oResponse)
													{
														ns1blankspace.financial.payroll.data.payPeriod = oResponse.data.rows[0];
														ns1blankspace.financial.payroll.data.report = _.assign({}, ns1blankspace.financial.payroll.data.payPeriod);
														
														ns1blankspace.financial.payroll.totals.employees.report.payPeriod(oParam)
													});
												}
											}
										}
									},

									payPeriod: function (oParam, oResponse)
									{
										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
											oSearch.addField('period');
											oSearch.addSummaryField('sum(grosssalary) grosssalary');
											oSearch.addSummaryField('sum(netsalary) netsalary');
											oSearch.addSummaryField('sum(superannuation) superannuation');
											oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
											oSearch.addSummaryField('sum(taxadjustments) taxadjustments');
											oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriodID)
											oSearch.rows = 0;
											oSearch.getResults(function(data)
											{
												//ns1blankspace.financial.payroll.data.payPeriodID = undefined;
												ns1blankspace.financial.payroll.totals.employees.report.payPeriod(oParam, data)
											});
										}
										else
										{
											ns1blankspace.financial.payroll.data.payPeriod = $.extend(true, ns1blankspace.financial.payroll.data.payPeriod, oResponse.summary)

											oParam.employerPeriodW1 = numeral(numeral(ns1blankspace.financial.payroll.data.payPeriod.grosssalary).value()).format('0.00');
											oParam.employerPeriodW2 = numeral(numeral(ns1blankspace.financial.payroll.data.payPeriod.taxbeforerebate).value()).format('0.00');

											oParam.guid = oParam.guid + '-' + moment(ns1blankspace.financial.payroll.data.payPeriod.startdate, ns1blankspace.option.dateFormats).format('YYYY-MM-DD')  + '-' + moment(ns1blankspace.financial.payroll.data.payPeriod.paydate, ns1blankspace.option.dateFormats).format('YYYY-MM-DD'),

											ns1blankspace.financial.payroll.data.report = _.assign(ns1blankspace.financial.payroll.data.report,
											{
												employerPeriodW1: oParam.employerPeriodW1,
												employerPeriodW2: oParam.employerPeriodW2,
												guid: oParam.guid

											});

											ns1blankspace.financial.payroll.totals.employees.report.payPeriodItems(oParam)
										}
									},

                                    payPeriodItems: function (oParam, oResponse)
                                    {
                                        //total by type and employee
                                        //https://docs.mydigitalstructure.cloud/FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH

                                        if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
											oSearch.addField('payrecorditem.payrecord.employee');
                                            oSearch.addField('type');
											oSearch.addField('notes');
											oSearch.addField('total');

                                            //oSearch.addField('sum(total) total');
											
                                            if (ns1blankspace.financial.payroll.data.startDate !== undefined)
                                            {
                                                oSearch.addFilter('payrecorditem.payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.startDate)
                                            }
                                                
                                            if (ns1blankspace.financial.payroll.data.endDate != undefined)
                                            {
                                                oSearch.addFilter('payrecorditem.payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.endDate)
                                            }
                                            
                                            oSearch.rows = 99999;
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.payroll.totals.employees.report.payPeriodItems(oParam, data)
											});
										}
										else
										{
                                            ns1blankspace.financial.payroll.data.payPeriodItems = oResponse.data.rows;

                                            _.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
                                            {
                                                oSummary.items = _.filter(ns1blankspace.financial.payroll.data.payPeriodItems, function (oPayPeriodItem)
                                                {
                                                    return oSummary.id == oPayPeriodItem['payrecorditem.payrecord.employee']
                                                });

                                                oSummary._lumpsum = [];
                                                oSummary._termination = [];
                                                oSummary._leave = [];
                                                oSummary._deductions = [];
												oSummary._allowances = [];
                                                oSummary._superannuation = [];
												oSummary._fringebenefits = [];
												oSummary._salarysacrifice = [];
                                            });
                                        
											ns1blankspace.financial.payroll.totals.employees.report.payPeriodLeave(oParam);
	
                                        }
                                    },

                                    payPeriodLeave: function (oParam, oResponse)
                                    {
										/*
											C (Cash out leave)
											U: Unused leave on Termination
											P: Paid parental leave
											W: Workers compensation
											A: Ancillary and defence leave
											O: Other paid leave: 
												 All other paid absences, regardless of rate of pay (full, half, reduced rate) must be reported as this payment type. It includes, but is not limited to annual leave, leave loading, long service leave, personal leave, RDOs. Services Australia categorise this type of payment as Employment Income or Lump Sum , depending on the payment frequency. These types of paid leave are OTE.
										*/

										var itemTypesLeaveReportingCodes = 
										[
											{
												code: 'O',
												itemLeaveTypes: ['1','2','3']
											}
										];

                                        var itemTypes = ns1blankspace.financial.payroll.util.linetypes.search({includeIn: 'leave'});
										var itemTypeIDs = _.map(itemTypes, 'id');

                                        _.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
                                        {
											var items =  _.filter(oSummary.items, function (item)
											{
												return (_.includes(itemTypeIDs, item.type))
											});

											if (items.length != 0)
											{
												_.each(itemTypesLeaveReportingCodes, function (itemTypesLeaveReportingCode)
												{
													var itemTypesBasedOnReportCode = _.filter(itemTypes, function (itemType)
													{
														return _.includes(itemTypesLeaveReportingCode.itemLeaveTypes, itemType.includeinleavetype)
													});

													if (itemTypesBasedOnReportCode.length != 0)
													{
														var itemTypesBasedOnReportCodeIDs = _.map(itemTypesBasedOnReportCode, 'id');

														var itemsBasedOnTypeBasedOnReportCode = _.filter(items, function (item)
														{
															return _.includes(itemTypesBasedOnReportCodeIDs, item.type)
														});

														if (itemsBasedOnTypeBasedOnReportCode.length != 0)
														{
															var itemTotal = _.sumBy(itemsBasedOnTypeBasedOnReportCode, function (item) {return numeral(item.total).value()});

															oSummary._leave.push(
															{
																code: itemTypesLeaveReportingCode.code,
																total: itemTotal
															});
														}
													}
												});
											}
                                        });

                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodAllowances(oParam)
                                    },

									payPeriodAllowances: function (oParam, oResponse)
                                    {
                                        var itemTypeIDs = ns1blankspace.financial.payroll.util.linetypes.search({includeIn: 'allowancestaxable', ids: true});

										var itemTypeAllowanceReportingCodes = 
										[
											{code: 'CD'},
											{code: 'AD'},
											{code: 'LD'},
											{code: 'RD'},
											{code: 'TD'},
											{code: 'OD'},
											{code: 'KN'},
											{code: 'QN'}
										];

										_.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
										{
											var items =  _.filter(oSummary.items, function (item)
											{
												return (_.includes(itemTypeIDs, item.type))
											});

											if (items.length != 0)
											{
												_.each(itemTypeAllowanceReportingCodes, function (itemTypeAllowanceReportingCode)
												{
													var itemsBasedOnTypeBasedOnReportCode = _.filter(items, function (item)
													{
														return (item.notes.toUpperCase() == itemTypeAllowanceReportingCode.code)
													});

													if (itemsBasedOnTypeBasedOnReportCode.length != 0)
													{
														var itemTotal = _.sumBy(itemsBasedOnTypeBasedOnReportCode, function (item) {return numeral(item.total).value()});

														oSummary._allowances.push(
														{
															code: itemTypeAllowanceReportingCode.code,
															total: itemTotal
														});
													}
												});
											}
										});
										
                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodSalarySacrifice(oParam)
                                    },

									payPeriodSalarySacrifice: function (oParam, oResponse)
                                    {
										var itemTypeIDs = ns1blankspace.financial.payroll.util.linetypes.search({includeIn: 'salarysacrifice', ids: true});

										_.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
										{
											var items =  _.filter(oSummary.items, function (item)
											{
												return (_.includes(itemTypeIDs, item.type))
											});

											if (items.length != 0)
											{
												var itemTotal = _.sumBy(items, function (item) {return numeral(item.total).value()});

												oSummary._salarysacrifice.push(
												{
													code: 'S',
													total: itemTotal
												});
											}
										});

                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodTermination(oParam)
                                    },

									payPeriodTermination: function (oParam, oResponse)
                                    {
                                        var itemTypes = ns1blankspace.financial.payroll.util.linetypes.search({text: 'Termination', ids: true})

                                        _.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
                                        {
                                            _.each(itemTypes, function (itemType)
                                            {
                                               var item =  _.find(oSummary.items, function (item)
                                                            {
                                                                return (itemType == item.type)
                                                            });

                                                if (item != undefined)
                                                {
                                                    oSummary._termination.push(
                                                    {
                                                        type: itemType,
                                                        total: item.total
                                                    });
                                                }
                                            });
                                        });

                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodDeductions(oParam)
                                    },

									payPeriodDeductions: function (oParam, oResponse)
                                    {
                                        var itemTypeIDs = ns1blankspace.financial.payroll.util.linetypes.search({includeIn: 'deductions', ids: true});

										var itemTypeDeductionReportingCodes = 
										[
											{code: 'F'},
											{code: 'W'},
											{code: 'G'},
											{code: 'D'}
										];

										_.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
										{
											var items =  _.filter(oSummary.items, function (item)
											{
												return (_.includes(itemTypeIDs, item.type))
											});

											if (items.length != 0)
											{
												_.each(itemTypeDeductionReportingCodes, function (itemTypeDeductionReportingCode)
												{
													var itemsBasedOnTypeBasedOnReportCode = _.filter(items, function (item)
													{
														return (item.notes.toUpperCase() == itemTypeDeductionReportingCode.code)
													});

													if (itemsBasedOnTypeBasedOnReportCode.length != 0)
													{
														var itemTotal = _.sumBy(itemsBasedOnTypeBasedOnReportCode, function (item) {return numeral(item.total).value()});

														oSummary._deductions.push(
														{
															code: itemTypeDeductionReportingCode.code,
															total: itemTotal
														});
													}
												});
											}
										});
										
                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodSuperannuation(oParam)
                                    },
   
                                    payPeriodSuperannuation: function (oParam, oResponse)
                                    {
	                                    _.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
                                        {
											oSummary._superannuation.push(
											{
												type: 'L',
												total: oSummary['superannuation']
											});
                                               
                                        });

                                        ns1blankspace.financial.payroll.totals.employees.report.payPeriodLogs(oParam)
                                    },

									payPeriodLogs: function (oParam, oResponse)
                                    {
                                        //https://docs.mydigitalstructure.cloud/FINANCIAL_PAYROLL_PAY_PROCESS_LOG_SEARCH

                                        if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PROCESS_LOG_SEARCH';
											oSearch.addField('employee');
                                            oSearch.addField('notes');
											
                                            /*
											if (ns1blankspace.financial.payroll.data.startDate !== undefined)
                                            {
                                                oSearch.addFilter('log.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.startDate)
                                            }
                                                
                                            if (ns1blankspace.financial.payroll.data.endDate != undefined)
                                            {
                                                oSearch.addFilter('log.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.endDate)
                                            }
											*/

											oSearch.addFilter('payperiod', 'EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriodID);
											//oSearch.addFilter('notes', 'TEXT_STARTS_WITH', '[TAX-S');
											
                                          
                                            oSearch.rows = 99999;
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.payroll.totals.employees.report.payPeriodLogs(oParam, data)
											});
										}
										else
										{
                                            ns1blankspace.financial.payroll.data.payPeriodLogs = oResponse.data.rows;

                                            _.each(ns1blankspace.financial.payroll.data.summaries, function (oSummary)
                                            {
                                                oSummary.logs = _.filter(ns1blankspace.financial.payroll.data.payPeriodLogs, function (payPeriodLog)
                                                {
                                                    return (oSummary.id == payPeriodLog['employee']) && (_.includes(payPeriodLog['notes'], '[TAX-S'))
                                                });

												oSummary._lognotes = _.join(_.map(oSummary.logs, function (log)
												{
													log._notes = _.replace(log.notes, '[TAX-S:', '');
													log._notes = _.replace(log._notes, '[TAX-S-a:', '');
													log._notes = _.replace(log._notes, ']', '');
													return log._notes;
												}), ', ');

												//oSummary.taxtreatmentcode = 'RTXXXX';
                                            });
                                        
											ns1blankspace.financial.payroll.totals.employees.report.create(oParam)
	
                                        }
                                    },

									create: function (oParam, oResponse)
									{
										var bCaptionOnly = true;
                                        var sFormatVersion = '2';

                                        //3.9.16
										var oFormat = ns1blankspace.financial.payroll.totals.employees.report.data[sFormatVersion].format;
										var oSummaries = ns1blankspace.financial.payroll.data.summaries;
										var oData = {};
										var oItemData = {};
										var bMustBeSet;
										var oDataFileHeader = {}

										ns1blankspace.financial.payroll.totals.employees.report.data.object = undefined;
										ns1blankspace.financial.payroll.totals.employees.report.data.errors = [];
										ns1blankspace.financial.payroll.totals.employees.report.data.format = oFormat;

										var oParamReport = ns1blankspace.financial.payroll.data.report;
										
										oParam = _.assign(oParam, oParamReport);

										$.each(oSummaries, function (s, oSummary)
										{
											if (oSummary.startdate == undefined) {oSummary.startdate = oParam.startDate}
											if (oSummary.enddate == undefined) {oSummary.enddate = oParam.endDate}
											oSummary.tax = numeral(oSummary.taxbeforerebate).value() + numeral(oSummary.taxadjustments).value()
										})

										if (oSummaries != undefined)
										{
											$.each(oFormat.header.fields, function (f, field)
											{
												bMustBeSet = field.mustBeSet;
												if (bMustBeSet == undefined) {bMustBeSet = oFormat.header.mustBeSetDefault}

												if (!_.isUndefined(field.value))
												{
													if (_.isArray(field.value))
													{
														oData[field.name] = _.clone(field.value);
													}
													else
													{
														oData[field.name] = field.value;
													}
												}
												else
												{
													oData[field.name] = _.trim(oParam[field.param]);
												}

												if (field.dateAdd != undefined)
												{
													var oDate = moment(oData[field.name], ns1blankspace.option.dateFormats)

													if (oDate.isValid())
													{
														if (field.dateAdd.duration.unit == undefined)
														{
															field.dateAdd.duration.unit = 'day'
														}

														oData[field.name] = oDate.add(field.dateAdd.duration, field.dateAdd.unit);
													}
												}

												if (field.dateFormat != undefined)
												{
													var oDate = moment(oData[field.name], ns1blankspace.option.dateFormats)

													if (oDate.isValid())
													{
														if (field.dateUTC)
														{
															oDate = oDate.utc();
														}

														oData[field.name] = oDate.format(field.dateFormat);
													}
												}

												if (field.onlyIfData && oData[field.name] == undefined)
												{
													delete oData[field.name]
												}

												if (bCaptionOnly && field.caption == undefined)
												{
													//delete oData[field.name]
												}

												if (oData[field.name] != undefined && field.caption != undefined)
												{
													oDataFileHeader[field.caption] =  oData[field.name];

													if (field.dateFormat != undefined)
													{
														var oDate = moment(oDataFileHeader[field.caption], field.dateFormat)

														if (oDate.isValid())
														{
															oDataFileHeader[field.caption] = oDate.format('D/M/YYYY');
														}
													}
												}

												if (bMustBeSet && (oData[field.name] == undefined || oData[field.name] == ''))
												{
													ns1blankspace.financial.payroll.totals.employees.report.data.errors.push(
													{
														type: 'header',
														name: field.name,
														help: field.help
													});
												}
											});

											ns1blankspace.financial.payroll.totals.employees.report.data.fileHeader = oDataFileHeader;
											ns1blankspace.financial.payroll.totals.employees.report.data.fileData = [];

											var bMustBeSetDefault;

											$.each(oFormat.item, function (i, oItem)
											{
												$.each(oItem.fields, function (f, oField)
												{
													if (oField.mustBeSet == undefined)
													{
														oField.mustBeSet = oItem.mustBeSetDefault
													}
												});

												var oHeaderFormatItem = _.find(ns1blankspace.financial.payroll.totals.employees.report.data.format.header.fields, function (field)
												{
													return (field.name == oItem.parentName)
												});

												if (oHeaderFormatItem != undefined)
												{
													var oDataFileItem;

													$.each(oSummaries, function (s, oSummary)
													{
														oItemData = {id: oSummary.id};
														oDataFileItem = {};

														oSummary['employee.taxfreethreshold'] = (oSummary['employee.taxfreethreshold']=='Y'?'true':'false')
														oSummary['employee.deducthelp'] = (oSummary['employee.deducthelp']=='Y'?'true':'false')

														$.each(oItem.fields, function (f, oField)
														{
															bMustBeSet = oField.mustBeSet;
															
															if (!_.isUndefined(oField.value))
															{
																if (!_.isArray(oField.value))
																{
																	oItemData[oField.name] = oField.value;
																}
																else
																{
																	//Get items - oField
																	oItemData[oField.name] = ns1blankspace.financial.payroll.totals.employees.report.createItems(oField, oSummary)
																}
															}
															else
															{
																if (!_.isUndefined(oField.field))
																{
																	oItemData[oField.name] = _.trim(oSummary[oField.field]);
																}
																else if (!_.isUndefined(oField.param))
																{
																	oItemData[oField.name] = _.trim(oParam[oField.param]);
																}
																else if (!_.isUndefined(oField.defaultValue))
																{
																	oItemData[oField.name] = oField.defaultValue;
																}
															}

															if (oField.onlyIfData && oItemData[oField.name] == undefined)
															{
																delete oItemData[oField.name]
															}

															if (oField.onlyIfNotZero && oItemData[oField.name] == 0)
															{
																delete oItemData[oField.name]
															}

															if (oField.currency)
															{
																if (oItemData[oField.name] == '' || oItemData[oField.name] == undefined)
																{
																	oItemData[oField.name] = '0'
																}

																oItemData[oField.name] = numeral(numeral(oItemData[oField.name]).value()).format('0.00');
															}

															if (oField.numeric)
															{
																if (oItemData[oField.name] == '' || oItemData[oField.name] == undefined)
																{
																	oItemData[oField.name] = '0'
																}

																oItemData[oField.name] = numeral(oItemData[oField.name]).value();
															}

															if (oField.dateFormat != undefined)
															{
																var oDate = moment(oItemData[oField.name], ns1blankspace.option.dateFormats)

																if (oDate.isValid())
																{
																	oItemData[oField.name] = oDate.format(oField.dateFormat);
																}
															}

															if (bCaptionOnly && oField.caption == undefined)
															{
																delete oItemData[oField.name]
															}

															if (bMustBeSet && (oItemData[oField.name] == undefined || oItemData[oField.name] == ''))
															{
																ns1blankspace.financial.payroll.totals.employees.report.data.errors.push(
																{
																	type: 'item',
																	name: oField.name,
																	id: oSummary.id,
																	help: oField.help
																});
															}

															if (oItemData[oField.name] != undefined && oField.caption != undefined)
															{
																oDataFileItem[oField.caption] = oItemData[oField.name];

																if (oField.dateFormat != undefined)
																{
																	var oDate = moment(oDataFileItem[oField.caption], oField.dateFormat)

																	if (oDate.isValid())
																	{
																		oDataFileItem[oField.caption] = oDate.format('D/M/YYYY');
																	}
																}
															}

															if (oField.mappings != undefined)
															{
																if (oField.mappings[oItemData[oField.name]] != undefined)
																{
																	oItemData[oField.name] = oField.mappings[oItemData[oField.name]];
																}
															}
														});

														ns1blankspace.financial.payroll.totals.employees.report.data.fileData.push(
																	$.extend(true, _.clone(ns1blankspace.financial.payroll.totals.employees.report.data.fileHeader), _.clone(oDataFileItem)))

														if (_.isArray(oData[oItem.parentName]))
														{
															oData[oItem.parentName].push(oItemData);
														}
														else
														{
															oData[oItem.parentName] = oItemData;
														}
													});
												}
											});

											ns1blankspace.financial.payroll.totals.employees.report.data.object = oData;

											ns1blankspace.financial.payroll.totals.employees.report.status(oParam)
										}	
									},

									createItems: function (oField, oSummary)
									{
										var itemsData = [];
										var itemData = {};

										var oFormatItem = _.find(ns1blankspace.financial.payroll.totals.employees.report.data.format.item, function (formatItem)
										{
											return (formatItem.parentName == oField.name)
										});

										if (oFormatItem != undefined)
										{									 
                                            //if source ie array then loop - sourceL '_deductions'
                                            if (oFormatItem.source != undefined)
                                            {
                                                if (_.isArray(oSummary[oFormatItem.source]))
                                                {
                                                    _.each(oSummary[oFormatItem.source], function (summarySource)
                                                    {
                                                        itemData = {};

                                                        _.each(oFormatItem.fields, function (field)
                                                        {
                                                            if (field.value != undefined)
                                                            {
                                                                itemData[field.name] = field.value;
                                                            }
                                                            else if (field.source != undefined)
                                                            {
                                                                itemData[field.name] = summarySource[field.source];
                                                            }

															if (field.currency)
															{
																if (itemData[field.name] == '' || itemData[field.name] == undefined)
																{
																	itemData[field.name] = '0'
																}

																itemData[field.name] = numeral(numeral(itemData[field.name]).value()).format('0.00');
															}

															if (field.numeric)
															{
																if (itemData[field.name] == '' || itemData[field.name] == undefined)
																{
																	itemData[field.name] = '0'
																}

																itemData[field.name] = numeral(itemData[field.name]).value();
															}

															if (field.dateFormat != undefined)
															{
																var oDate = moment(itemData[field.name], ns1blankspace.option.dateFormats)

																if (oDate.isValid())
																{
																	itemData[field.name] = oDate.format(field.dateFormat);
																}
															}
                                                        });

                                                        itemsData.push(itemData);
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                _.each(oFormatItem.fields, function (field)
                                                {
                                                    if (field.value != undefined)
                                                    {
														if (!_.isArray(field.value))
														{
															itemData[field.name] = field.value;
														}
														else
														{
															itemData[field.name] = ns1blankspace.financial.payroll.totals.employees.report.createItems(field, oSummary)
														}
                                                    }
                                                    else if (field.summary != undefined)
                                                    {
                                                        itemData[field.name] = oSummary[field.summary];
                                                    }

                                                    if (field.currency)
                                                    {
                                                        itemData[field.name] = numeral(itemData[field.name]).format('0.00')
                                                    }
                                                });

                                                itemsData.push(itemData);
                                            }
										}
										
										return itemsData;
									},

									status: function (oParam, oResponse)
									{
										var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

										if (oResponse == undefined)
										{
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
											oSearch.addField('startdate,paydate,guid');
											oSearch.addFilter('paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate);
											oSearch.addFilter('status', 'EQUAL_TO', 1);
											oSearch.getResults(function(data)
											{
												ns1blankspace.financial.payroll.totals.employees.report.status(oParam, data)
											});
										}
										else
										{
											ns1blankspace.financial.payroll.totals.employees.report.data.inProgress = oResponse.data.rows;
											ns1blankspace.financial.payroll.totals.employees.report.show(oParam);
										}
										
									},

									show: function (oParam, oResponse)
									{
										var aHTML = [];
										var aItemHTML;
										var oError;
										var sStatus;
										var sValue;

										if (ns1blankspace.financial.payroll.data._param.msalAccessToken != undefined)
										{
											//as ' +
											//		ns1blankspace.financial.payroll.data._param.msalUsername + 
											//			' (' + ns1blankspace.financial.payroll.data._param.msalEmail + ')' +

											aHTML.push('<div style="font-size:0.875em; margin-bottom:12px;" class="alert alert-warning">' +
												'<div><strong>You can submit online (see below) as you are currently signed into the singletouch.com.au service.</strong></div></div>');

											var aActionsLite = $.grep(ns1blankspace.financial.payroll.totals.employees.report.history.data.actions,
																		function (oActions)
																		{
																			return oActions.lite
																		});

											if (aActionsLite.length != 0)
											{
												aHTML.push('<div style="font-size: 0.875em;" class="alert alert-danger"><i style="color:red; text-align:center; padding-right:6px;" class="glyphicon glyphicon-warning-sign"></i> ' +
															' Within this financial year you have reported using <em>singletouch Lite</em>.  <strong>You need to set the start date as ' +
															moment(moment(aActionsLite[0].duedate, ns1blankspace.option.dateFormats).add(1, 'days')).format('DD MMM YYYY') +
															' and Refresh</strong>, so as to not include any payroll data reported to the ATO via <em>singletouch Lite</em>.</div>');
											}
										}

										aHTML.push('<div id="ns1blankspaceFinancialPayrollSTPSubmitContainer">' + ns1blankspace.xhtml.loading + '</div>')

										aHTML.push('<table class="table table-condensed" style="font-size:0.825em; margin-bottom:2px;">');

										if (ns1blankspace.financial.payroll.totals.employees.report.data.object != undefined)
										{
											$.each(ns1blankspace.financial.payroll.totals.employees.report.data.object, function (key, value)
											{
												if (!_.isArray(value))
												{
													sStatus = '';
													oError = _.find(ns1blankspace.financial.payroll.totals.employees.report.data.errors,
																			function (error)
																			{
																				return (error.name == key && error.type == 'header')
																			});

													sValue = value;

													if (oError != undefined)
													{
														sStatus = '<i style="color:red; text-align:center;" class="glyphicon glyphicon-warning-sign"></i>'

														if (oError.help != undefined)
														{
															sValue = '<span class="text-muted"><em>' + oError.help + '</em></span>'
														}
													}

													aHTML.push(
														'<tr>' +
														'<td style="width:10px;">' + sStatus + '</td>' +
														'<td style="width:170px;">' + key + '</td><td>' + sValue + '</td></tr>');
												}
												else
												{
													var sPayrollID;
													var aErrors;

													//Is this in the format.header.fields

													var oHeaderFormatItem = _.find(ns1blankspace.financial.payroll.totals.employees.report.data.format.header.fields, function (field)
													{
														return (field.name == key)
													});

													if (oHeaderFormatItem != undefined)
													{
														aItemHTML = ['<div class="panel-group" id="' + key + '">']

														$.each(value, function (v, itemValue)
														{
															if (itemValue['PayeePayrollID'] == '' || itemValue['PayeePayrollID'] == undefined)
															{
																sPayrollID = ''
															}
															else
															{
																sPayrollID = ' (' + itemValue['PayeePayrollID'] + ')'
															}

															sStatus = '';

															aErrors = _.filter(ns1blankspace.financial.payroll.totals.employees.report.data.errors,
																				function (error)
																				{
																					return (error.type == 'item' && error.id == itemValue.id)
																				});

															if (aErrors.length != 0)
															{
																sStatus = '<i style="color:red; text-align:center; margin-right:6px; margin-left:3px;" class="glyphicon glyphicon-warning-sign"></i>'
															}

															aItemHTML.push('<div class="panel panel-default">' +
																			'<div class="panel-heading">' +
																				'<a data-toggle="collapse" data-parent="#' + key + '" href="#' + key + v + '">' +
																				sStatus + 
																				itemValue['PayeeFirstName'] + ' ' + itemValue['PayeeFamilyName'] + 
																				sPayrollID +
																				'</a>' +
																			'</div>')
		
														aItemHTML.push('<div id="' + key + v + '" class="panel-collapse collapse">' +
																				'<div class="panel-body">' +
																				'<table class="table table-condensed table-striped" style="font-size:0.825em;">')

														$.each(itemValue, function (ivkey, itemValueValue)
															{
																if (ivkey != 'id')
																{
																	sStatus = '';
																	oError = _.find(ns1blankspace.financial.payroll.totals.employees.report.data.errors,
																					function (error)
																					{
																						return (error.name == ivkey && error.type == 'item' && error.id == itemValue.id)
																					});

																	sValue = itemValueValue;

																	if (oError != undefined)
																	{
																		sStatus = '<i style="color:red; text-align:center;" class="glyphicon glyphicon-warning-sign"></i>';
																		if (oError.help != undefined)
																		{
																			sValue = '<span class="text-muted"><em>' + oError.help + '</em></span>';
																		}
																	}

																	if (_.isPlainObject(sValue))
																	{
																		sValue = JSON.stringify(sValue)
																	}

																	if (_.isArray(sValue))
																	{
																		if (sValue.length == 0)
																		{
																			sValue = ''
																		}
																		else if (sValue.length == 1)
																		{
																			var aValue = [];

																			aValue.push('<table class="table table-condensed table-striped">');

																			_.each(_.first(sValue), function (value, key)
																			{
																				if (_.isArray(value))
																				{
																					var aValueValue = [];
																					aValueValue.push('<table class="table table-condensed table-striped">');

																					_.each(value, function (valueValue)
																					{
																						_.each(valueValue, function (_valueValue, _valueKey)
																						{
																							aValueValue.push('<tr><td class="col-sm-5">' + _valueKey + '</td><td class="col-sm-7">' + _valueValue + '</td></tr>');
																						});
																					});

																					aValueValue.push('</table>');
																			
																					value = aValueValue.join('');
																				}

																				aValue.push('<tr><td class="col-sm-5">' + key + '</td><td class="col-sm-7">' + value + '</td></tr>');
																			});

																			aValue.push('</table>');
																			
																			sValue = aValue.join('');
																		}
																		else
																		{

																		}
																		
																	}

																	aItemHTML.push(
																		'<tr><td style="width:10px;">' + sStatus + '</td><td>' + ivkey + '</td><td>' + sValue + '</td></tr>');
																}	
															});

														aItemHTML.push('</table>' +
																			'</div>' + 
																				'</div></div>');					

														});

														aItemHTML.push('</div>');

														aHTML.push(
															'<tr><td style="width:10px;"></td><td>' + key + '</td><td>' + aItemHTML.join('') + '</td></tr>');
													}
												}
											});
										}

										aHTML.push('</table>')

										$('#ns1blankspacePayrollEmployeeTotalsColumn1').html(aHTML.join(''));

										var aHTML = [];

										if (ns1blankspace.financial.payroll.totals.employees.report.data.errors.length > 0)
										{
											aHTML.push('<div style="font-size: 0.875em;" class="alert alert-danger"><i style="color:red; text-align:center; padding-right:6px;" class="glyphicon glyphicon-warning-sign"></i> ' +
															' As there are errors in the data (see below), you should not submit this file to the ' + ns1blankspace.option.taxOffice + '.</div>');
										}

										if (ns1blankspace.financial.payroll.totals.employees.report.data.inProgress.length > 0)
										{
											aHTML.push('<div style="font-size: 0.875em;" class="alert alert-danger"><i style="color:red; text-align:center; padding-right:6px;" class="glyphicon glyphicon-warning-sign"></i> ' +
															' This pay period or ' + (ns1blankspace.financial.payroll.totals.employees.report.data.inProgress.length==1?'one pay period':'' +
															ns1blankspace.financial.payroll.totals.employees.report.data.inProgress.length + ' pay periods') + ' prior to this reporting end date are still in progress, you should not submit this file to the ' + ns1blankspace.option.taxOffice + '.</div>');
										}

										aHTML.push('<div class="well text-muted" style="font-size:0.825em;">');

											aHTML.push('<div style="font-size:1.6em;"><strong>Submit payroll data to the ' + ns1blankspace.option.taxOffice + '</strong></div>');

											aHTML.push('<div style="margin-top:12px;">Payroll data is sent to the ATO using the <a href="https://singletouch.com.au" target="_blank">singletouch.com.au</a> sending service.</div>');
											aHTML.push('<div>You can either download the data as a CSV file and then upload it, or send online.</div>');

											aHTML.push('<div style="margin-top:12px;">Your employees can view their payroll data you submit by logging on to <a href="my.gov.au" target="_blank">my.gov.au</a> and once linked to their ATO account, selecting Employment > Income Statements.</div>');

											aHTML.push('<div style="margin-top:12px;" id="ns1blankspacePayrollTotalsSTPDataStatus"></div>');

											aHTML.push('<div style="margin-top:6px;">' +
															'<input type="checkbox" checked="checked" id="ns1blankspacePayrollTotalsSTPDataFileRecord"> <span class="ns1blankspaceSub">Mark as submitted to ' + ns1blankspace.option.taxOffice + '?</span>' +
															'</div>');

											var aActionsPortal = $.grep(ns1blankspace.financial.payroll.totals.employees.report.history.data.actions,
																		function (oActions)
																		{
																			return oActions.portal
																		});

											if (aActionsPortal.length == 0 && ns1blankspace.financial.payroll.data._param.msalAccessToken == undefined)
											{
												aHTML.push('<div style="margin-top:6px;">' +
															'<input type="checkbox" checked="checked" id="ns1blankspacePayrollTotalsSTPDataFileProductID"> <span class="ns1blankspaceSub">Are you using <em>singletouch Lite</em>?</span>' +
															'</div>');
											}	

											aHTML.push('<div style="margin-top:12px;">' +
																'<span id="ns1blankspacePayrollTotalsSTPDataFile" class="ns1blankspaceAction"></span></div>');

											aHTML.push('<div style="margin-top:12px;">');

											if (true || ns1blankspace.user.super)
											{
												if (ns1blankspace.financial.payroll.data._param.msalAccessToken != undefined)
												{
													aHTML.push(' <span id="ns1blankspacePayrollTotalsSTPDataSubmit" class="ns1blankspaceAction"></span>');
												}
												else
												{
													aHTML.push(
															'<p>' +
																'To submit your payroll data online you need to sign in to singletouch.com.au using the button below.</p>' +
																'<p>After you have signed in return to this page.' +
															'</p>' +
															'<div id="ns1blankspacePayrollTotalsSTPDataSubmitSignIn" class="ns1blankspaceAction"></div>');
												}
											}
											
											aHTML.push('</div>');

											aHTML.push('<div style="margin-top:12px;" id="ns1blankspacePayrollTotalsSTPDataSubmitContainer">' +
																	'</div>');

										aHTML.push('</div>');

										$('#ns1blankspaceFinancialPayrollSTPSubmitContainer').html(aHTML.join(''));

										$('#ns1blankspacePayrollTotalsSTPDataFile').button(
										{
											label: 'Download as a CSV file'
										})
										.click(function()
										{		
											 ns1blankspace.financial.payroll.totals.employees.report.file(oParam)
										});

										$('#ns1blankspacePayrollTotalsSTPDataSubmitSignIn').button(
										{
											label: 'Sign in to singletouch.com.au'
										})
										.click(function()
										{		
											var oMSAL =
											{
												context: 'payPeriod:' + ns1blankspace.financial.payroll.data.payPeriod.id + 
																',isFinalForYear:' + ns1blankspace.financial.payroll.data.isFinalForYear +
																',startDate:' + oParam.startDate +
																',endDate:' + oParam.endDate +
																',submitOnline:true'
											}

											var sVersion = '2';
											var oTenants = ns1blankspace.financial.payroll.totals.employees.report.data[sVersion].tenants;
											var oMSALs = ns1blankspace.financial.payroll.totals.employees.report.data[sVersion].msals;
											var sType = 'sandbox';
											//var sType = 'production';

											oMSAL.tenant = oTenants[sType];
											
											/*if (ns1blankspace.session.labInstance)
											{
												oMSAL.tenant = 'singletouchsandbox.onmicrosoft.com/b2c_1_singletouch'
											}
											else
											{
												oMSAL.tenant = 'singletouch.onmicrosoft.com/b2c_1_singletouch'
											}*/

											ns1blankspace.unloadWarning = false;

											var sMSALURI = oMSALs[sType]
											//'https://msal.mydigitalstructure.cloud'
											
											/*if (ns1blankspace.session.labInstance)
											{
												sMSALURI = 'https://app-next-1blankspace.mydigitalstructure.cloud/msal'
											}*/

											location.href = sMSALURI + '/#msal:' + window.btoa(JSON.stringify(oMSAL))	
										});

										$('#ns1blankspacePayrollTotalsSTPDataSubmit').button(
										{
											label: 'Submit online using singletouch.com.au'
										})
										.click(function()
										{		
											 ns1blankspace.financial.payroll.totals.employees.report.submit.confirm(oParam)
										});

										ns1blankspace.financial.payroll.totals.employees.report.history.show(oParam)
									},

									file: function (oParam, oResponse)
									{
										if (ns1blankspace.financial.payroll.totals.employees.report.data.fileData != undefined)
										{
											ns1blankspace.status.working('Creating file...');

											var bIncludeProductID = !($('#ns1blankspacePayrollTotalsSTPDataFileProductID').prop('checked'));
											var bHistoryRecord = ($('#ns1blankspacePayrollTotalsSTPDataFileRecord').prop('checked'));

											var oOptions = 
											{
												delimiter: ',',
												surroundWith: '"'
											}

											var aFile = [];

											$.each(ns1blankspace.financial.payroll.totals.employees.report.data.fileData[0], function (sKey, oValue)
											{
												aFile.push(oOptions.surroundWith);
												aFile.push(sKey)
												aFile.push(oOptions.surroundWith);
												aFile.push(oOptions.delimiter);
											});

											aFile[aFile.length - 1] = '\r\n';

											$.each(ns1blankspace.financial.payroll.totals.employees.report.data.fileData, function (fd, oFileData)
											{
												$.each(oFileData, function (sKeyFileData, sValueFileData, index)
												{
													if (!bIncludeProductID && sKeyFileData == 'Product ID') {sValueFileData = ''}
													if (!bIncludeProductID && sKeyFileData == 'BMS ID') {sValueFileData = ''}
													if (!bIncludeProductID && sKeyFileData == 'Branch ID') {sValueFileData = ''}

													aFile.push(oOptions.surroundWith);
													aFile.push(sValueFileData)
													aFile.push(oOptions.surroundWith);
													aFile.push(oOptions.delimiter);
												});

												aFile[aFile.length - 1] = '\r\n';
											});

											ns1blankspace.financial.payroll.totals.employees.report.data.file = aFile.join('');

											var oParam =
											{
												fileName: 'stp-' + oParam.guid + '.csv',
												data: ns1blankspace.financial.payroll.totals.employees.report.data.file,
												open: true,
												includeProductID: bIncludeProductID,
												type: 'CSV'
											}

											ns1blankspace.setup.file["export"].saveToFile(oParam);

											if (bHistoryRecord)
											{
												ns1blankspace.financial.payroll.totals.employees.report.history.record(oParam);
											}

											ns1blankspace.status.message('File created');
										}
									},

									history:
									{
										data: {},

										record: function (oParam, oResponse)
										{
											if (oResponse == undefined)
											{
												var sActionReference = '[STP-SUBMIT-ST]';
												var sActionDescription = '';

												if (oParam.type != undefined)
												{
													sActionDescription = sActionDescription + '[' + oParam.type + ']';
												}

												if (oParam.includeProductID == undefined) {oParam.includeProductID = true}

												if (!oParam.includeProductID)
												{
													sActionDescription = sActionDescription + '[LITE]';
												}

												sActionDescription = sActionDescription + ' STP Submitted to ATO using singletouch.com.au';

												var oData = 
												{
													object: 37,
													objectcontext: ns1blankspace.financial.payroll.data.payPeriod.id,
													actionreference: sActionReference,
													description: sActionDescription,
													duedate: moment(ns1blankspace.financial.payroll.data.endDate, ns1blankspace.option.dateFormats).format('DD MMM YYYY'),
													completed: moment().format('DD MMM YYYY HH:mm'),
													status: 1,
													xactionby: ns1blankspace.user.id,
													actiontype: 4
												}

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
													data: oData,
													dataType: 'json',
													global: false,
													success: function(data)
													{
														ns1blankspace.financial.payroll.totals.employees.report.history.record(oParam, data)
													}
												});
											}
											else
											{
												if (oResponse.status == 'OK')
												{
													ns1blankspace.status.message('Recorded as submitted');
												}
											}
										},

										actions: function (oParam, oResponse)
										{
											if (oResponse == undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'ACTION_SEARCH';
												oSearch.addField('actionreference,duedate,objectcontext,description,completed');
												oSearch.addFilter('object', 'EQUAL_TO', 37);
												oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.startDate)
												oSearch.addFilter('actionreference', 'EQUAL_TO', '[STP-SUBMIT-ST]');
												oSearch.rows = 9999
												oSearch.sort('completed', 'desc');
												oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.employees.report.history.actions(oParam, data)});	
											}
											else
											{
												var oData = {lite: false, api: false, csv: false}
												var aActions;

												ns1blankspace.financial.payroll.totals.employees.report.history.data.actions = undefined;

												if (oResponse.status == 'OK')
												{
													ns1blankspace.financial.payroll.totals.employees.report.history.data.actions = oResponse.data.rows;

													$.each(ns1blankspace.financial.payroll.totals.employees.report.history.data.actions, function (a, oAction)
													{
														oAction.csv = ($.grep(oResponse.data.rows, function (oRow) {return oRow.description.indexOf('[CSV]') != -1}).length != 0)
														oAction.api = ($.grep(oResponse.data.rows, function (oRow) {return oRow.description.indexOf('[API]') != -1}).length != 0)
														oAction.lite = ($.grep(oResponse.data.rows, function (oRow) {return oRow.description.indexOf('[LITE]') != -1}).length != 0)
														oAction.portal = ($.grep(oResponse.data.rows, function (oRow) {return oRow.description.indexOf('[LITE]') == -1}).length != 0)
													})
												}

												ns1blankspace.util.onComplete(oParam);
											}
										},

										show: function (oParam, oResponse)
										{
											var aObjectContexts = ns1blankspace.util.getParam(oParam, 'objectContexts').value;

											if (oResponse == undefined)
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = 'ACTION_SEARCH';
												oSearch.addField('actionreference,duedatetime,objectcontext,description,completed');
												oSearch.addFilter('object', 'EQUAL_TO', 37);

												if (aObjectContexts == undefined)
												{
													//oSearch.addFilter('objectcontext', 'LESS_THAN_OR_EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriod.id)
													oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.financial.payroll.data.payPeriod.id)
													oSearch.rows = 1
													oSearch.sort('objectcontext', 'desc');
												}
												else
												{
													oSearch.addFilter('objectcontext', 'IN_LIST', aObjectContexts.join(','));
													oSearch.rows = 9999;
												}

												oSearch.sort('completed', 'desc');
													
												oSearch.addFilter('actionreference', 'EQUAL_TO', '[STP-SUBMIT-ST]');
												oSearch.getResults(function(data) {ns1blankspace.financial.payroll.totals.employees.report.history.show(oParam, data)});	
											}
											else
											{
												if (oResponse.status == 'OK')
												{
													var sHTML;

													if (aObjectContexts == undefined)
													{
														sHTML = '<p>This pay period has NOT been marked as submitted to the ' + ns1blankspace.option.taxOffice + '.</p>';

														if (oResponse.data.rows.length > 0)
														{
															sHTML = '<p>This pay period has been marked as submitted to the ' + ns1blankspace.option.taxOffice + ' (' + oResponse.data.rows[0].completed + ').</p>';

															if (oResponse.data.rows[0].description.indexOf('[CSV]') != -1)
															{
																sHTML = sHTML + '<p>It was downloaded as a CSV file.</p>'
															}

															if (oResponse.data.rows[0].description.indexOf('[API]') != -1)
															{
																sHTML = sHTML + '<p>It was submitted online.</p>'
															}

															if (oResponse.data.rows[0].description.indexOf('[LITE]') != -1)
															{
																sHTML = sHTML + '<p>It was submitted using <em>singletouch Lite</em>.</p>'
															}

															$('#ns1blankspacePayrollTotalsSTPDataFileProductID').prop('checked', (oResponse.data.rows[0].description.indexOf('[LITE]') != -1))
														}
														
														$('#ns1blankspacePayrollTotalsSTPDataStatus').html('<span class="ns1blankspaceSub" style="font-weight:bold;">' + sHTML + '</span>');
													}
													else
													{
														var aActions;
														var bSubmitted = false;

														$.each(aObjectContexts, function (oc, sObjectContext)
														{
															aActions = $.grep(oResponse.data.rows, function (row) {return row.objectcontext == sObjectContext});

															if (aActions.length == 0)
															{
																if (bSubmitted)
																{
																	sHTML = '';
																}
																else
																{
																	sHTML = 'Not submitted' +
																				' <button class="btn btn-warning btn-xs ns1blankspaceRowTotalsView" id="ns1blankspacePayrollTotalsSTPDataStatus-' + sObjectContext + '">Submit now</button>';
																}
															}
															else
															{
																bSubmitted = true;

																if (aActions[0].description.indexOf('[CSV]') != -1)
																{
																	sHTML = 'Submitted as a CSV file ';

																	if (aActions[0].description.indexOf('[LITE]') != -1)
																	{
																		sHTML = sHTML + 'using <em>singletouch Lite</em> ';
																	}
																}

																if (aActions[0].description.indexOf('[API]') != -1)
																{
																	sHTML = 'Submitted online using <em>singletouch</em> ';
																}

																sHTML = sHTML + '(' + aActions[0].completed + ')' +
																				' <button class="btn btn-default btn-xs ns1blankspaceRowTotalsView" id="ns1blankspacePayrollTotalsSTPDataStatus-' + sObjectContext + '">View data</button>'
															}

															$('#ns1blankspaceMostLikely_totals-' + sObjectContext).html(sHTML);
														});

														$('.ns1blankspaceRowTotalsView:visible')
														.click(function()
														{
															$('td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
															$('#ns1blankspaceControl_totals').addClass('ns1blankspaceHighlight');

															ns1blankspace.show({selector: '#ns1blankspaceMainTotals', refresh: true});

															var oData = $(this).parent();

															ns1blankspace.financial.payroll.totals.init(
															{
																startDate: ns1blankspace.financial.util.financialYear(oData.attr('data-paydate')).start,
																endDate: oData.attr('data-paydate'),
																guid: oData.attr('data-guid'),
																payPeriod: oData.attr('data-id')
															});
														})
													}
												}
											}
										}
									},

									submit:
									{
										confirm: function (oParam)
										{
											if (ns1blankspace.financial.payroll.data._param.msalAccessToken == undefined)
											{
												ns1blankspace.status.error('You need to sign in to singletouch.')
											}
											else
											{
												var sHTML = 
												'<div class="well text-muted">' +
													'<p>' +
														'Tick the box below to sign the declaration with the credentials you used to login and to authorise lodgement with Single Touch Pty Ltd\'s AUSkey' +
													'</p>' +
										        	'<p>' +
										        		'I am notifying the ATO that:' +
										        	'</p>' +
										        	'<ul>' +
										        		'<li>Single Touch Pty Ltd provides my business with lodgment transaction services;</li>' +
										        		'<li>and my business, for the purposes of its transactions with the ATO via the SBR channel, sends (and receives) those transactions' +
										          	'to (and from) the ATO via Single Touch Pty Ltd</li>' +
										         '</ul>' +
										         '<p>' +
										         	'<input type="checkbox" id="ns1blankspacePayrollTotalsSTPDataSubmitSendDeclaration"> I declare the information transmitted in this payroll report is true and correct and I am authorised to make this declaration' +
										         '</p>' +
										         '<div class="form-group">' +
	  													'<label for="ns1blankspacePayrollTotalsSTPDataSubmitSendName" class="text-muted">Your name</label>' +
															'<input type="text" class="form-control" id="ns1blankspacePayrollTotalsSTPDataSubmitSendName">' +
													'</div>' +
													'<div id="ns1blankspacePayrollTotalsSTPDataSubmitSend" class="ns1blankspaceAction hidden"></div>' +
													'<div id="ns1blankspacePayrollTotalsSTPDataSubmitSendStatus" style="margin-top:18px;"></div>' +
												'</div>';

												$('#ns1blankspacePayrollTotalsSTPDataSubmitContainer').html(sHTML);

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSend').button(
												{
													label: 'Send To ' + ns1blankspace.option.taxOffice
												})
												.click(function()
												{		
													ns1blankspace.financial.payroll.totals.employees.report.submit.send(oParam)
												});

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSendDeclaration').click(function (event)
												{
													ns1blankspace.financial.payroll.totals.employees.report.submit.okToSend()	
												});

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSendName').keyup(function (event)
												{
													ns1blankspace.financial.payroll.totals.employees.report.submit.okToSend()	
												});

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSendName').val(ns1blankspace.user.commonName);
											}
										},

										okToSend: function (oParam)
										{
											var bOKToSend = $('#ns1blankspacePayrollTotalsSTPDataSubmitSendDeclaration').prop('checked');

											if (bOKToSend)
											{
												bOKToSend = ($('#ns1blankspacePayrollTotalsSTPDataSubmitSendName').val() != '')
											}

											$('#ns1blankspacePayrollTotalsSTPDataSubmitSend')[(bOKToSend?'remove':'add') + 'Class']('hidden')
										},

										send: function (oParam)
										{
											ns1blankspace.status.working('Sending to ATO...');

											var sVersion = '2';
											var oURLs = ns1blankspace.financial.payroll.totals.employees.report.data[sVersion].urls;
											var sType = 'sandbox';

											var sURL = oURLs[sType];

											console.log(ns1blankspace.financial.payroll.totals.employees.report.data.object)

											var oData = 
											{
												url: sURL,
												data: '[' + JSON.stringify(ns1blankspace.financial.payroll.totals.employees.report.data.object) + ']',
												headeroutname1: 'Authorization',
												headeroutvalue1: 'Bearer ' + ns1blankspace.financial.payroll.data._param.msalAccessToken,
												headeroutname2: 'Content-Type',
												headeroutvalue2: 'application/json',
												headerall: 'Y',
												type: 'POST'
											}

											$('#ns1blankspacePayrollTotalsSTPDataSubmitSend').addClass('hidden');
											$('#ns1blankspacePayrollTotalsSTPDataSubmitSendStatus').html('Sending...');

											$.ajax(
											{
												type: 'POST',
												url: '/rpc/core/?method=CORE_URL_GET',
												dataType: 'json',
												global: false,
												data: oData,
												success: function(data)
												{
													ns1blankspace.financial.payroll.totals.employees.report.submit.process(data)
												},
												error: function(data)
												{
													ns1blankspace.status.error(data)
												}
											});
										},

										process: function (oResponse)
										{
											ns1blankspace.status.clear();
											console.log(oResponse)

											if (oResponse.status == 'ER')
											{
												var oError;

												if (oResponse.error.errornotes.substr(0,1) == '{')
												{
													oError = JSON.parse(oResponse.error.errornotes)
													console.log(oError)
												}

												var aHTML = [];

												aHTML.push('<p><i style="color:red; text-align:center; padding-right:6px;" class="glyphicon glyphicon-warning-sign"></i>' +
														'<strong>An error has occured sending payroll data to the ' + ns1blankspace.option.taxOffice + '</strong></p>');

												if (oError != undefined)
												{
													if (oError.logMessages != undefined && oError.logMessages != '')
													{
														aHTML.push('<p>' + oError.logMessages + '</p>');
													}

													if (oError.infoMessages != undefined && oError.infoMessages != '')
													{
														aHTML.push('<p>' + oError.infoMessages + '</p>');
													}
												}
												else
												{
													aHTML.push('<p>' + oResponse.error.errornotes + '</p>')
												}

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSendStatus').html(aHTML.join(''))

											}
											else
											{
												var aHTML = [];
												var sMesssage = ns1blankspace.financial.payroll.totals.employees.report.submit.parse(oResponse.response)

												$('#ns1blankspacePayrollTotalsSTPDataSubmitSendStatus').html(sMesssage)

												var bHistoryRecord = ($('#ns1blankspacePayrollTotalsSTPDataFileRecord').prop('checked'));

												if (bHistoryRecord)
												{
													ns1blankspace.financial.payroll.totals.employees.report.history.record({type: 'API'});
												}
											}
										},

										parse: function (sResponse)
										{
											var oResponse;
											var aHTML = [];

											if (sResponse.substr(0,1) == '{')
											{
												oResponse = JSON.parse(sResponse);
											}

											if (oResponse != undefined)
											{
												if (oResponse.statusCode == '200')
												{
													aHTML.push('<p>' +
														'<strong>The payroll data has been sent to the ' + ns1blankspace.option.taxOffice + '!</strong></p>');
												}
												else
												{
													aHTML.push('<p><i style="color:red; text-align:center; padding-right:6px;" class="glyphicon glyphicon-warning-sign"></i>' +
														'<strong>An error has occured sending payroll data to the ' + ns1blankspace.option.taxOffice + '</strong></p>');
												}

												if (oResponse.logMessages != undefined && oResponse.logMessages != '')
												{
													oResponse.logMessages = oResponse.logMessages.replace('Response message returned from the SingleTouch API:<br/>', '');
													aHTML.push('<p>' + oResponse.logMessages + '</p>');
												}

												if (oResponse.infoMessages != undefined && oResponse.infoMessages != '')
												{
													aHTML.push('<p>' + oResponse.infoMessages + '</p>');
												}
											}

											return aHTML.join('')
										}
									}
								}								
				}
}

ns1blankspace.financial.payroll.pays.totals =
{
	show: 	function (oParam, oResponse)
				{
					
					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollPayTotalsColumn1" class="ns1blankspaceColumn1Divider" style="width:120px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollPayTotalsColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainPayTotals').html(aHTML.join(''));	

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('grosssalary,netsalary,deductions,superannuation,taxbeforerebate,taxadjustments,payrecord.employee.contactperson');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(netsalary) netsalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
						oSearch.addSummaryField('sum(taxadjustments) taxadjustments');
						oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
						oSearch.rows = 0;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays.totals.show(oParam, data)});	
					}
					else
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Net Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.netsalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxbeforerebate).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Tax Adjustments</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.taxadjustments).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>')


						if (ns1blankspace.user.super)
						{	
							aHTML.push('<tr><td style="text-align:left;" id="ns1blankspaceFinancialPayrollSuperannuationCheck" class="ns1blankspaceSubNote ns1blankspaceViewLink">' +
								'(check)</td></tr>');
						}	

						aHTML.push('</table>');

						$('#ns1blankspacePayrollPayTotalsColumn1').html(aHTML.join(''));

						$('#ns1blankspaceFinancialPayrollSuperannuationCheck').click(function(event)
						{
							ns1blankspace.financial.payroll.util.superannuation.pays(oParam);
						});

						ns1blankspace.financial.payroll.pays.totals.slips.show(oParam);
					}	
				},

	slips: 	{
					check: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
                                        var fromemail = ns1blankspace.financial.data.settings.messagingaccounttext;
                                        if (fromemail == '')
                                        {
                                            fromemail = ns1blankspace.user.email;
                                        }

										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
										oSearch.addField('email');
										oSearch.addFilter('email', 'EQUAL_TO', fromemail);
										oSearch.addFilter('verification', 'EQUAL_TO', 3)
										oSearch.rows = 1;
										oSearch.getResults(function(data){ns1blankspace.financial.payroll.pays.totals.slips.check(oParam, data)});
									}
									else
									{
										var bOK = (oResponse.status == 'OK')
										if (bOK) {bOK = (oResponse.data.rows.length != 0)}
										if (!bOK)
										{
											$('#ns1blankspacePayrollPayTotalsEmailContainer')
											.html('<div class="ns1blankspaceSubNote">If you want to email the pay slips, you need to set up a email sending account for the email address ' + ns1blankspace.user.email + '. To set up the email sending account click the cog icon in the header and then select Messaging.</div>');
										}
									}
								},

					show: 	function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										ns1blankspace.financial.data.pays = [];

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollPaySlipTotalsColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollPaySlipTotalsColumn2" style="width:105px;"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspacePayrollPayTotalsColumn2').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
										oSearch.addField('payrecord.grosssalary,payrecord.netsalary,payrecord.superannuation,payrecord.taxafterrebate,payrecord.taxbeforerebate,taxadjustments,' +
															'payrecord.employee.id,payrecord.employee.taxfilenumber,payrecord.employee.employeenumber,' +
															'payrecord.employee.contactperson,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.contactperson.email,' +
															'payrecord.payperiod.startdate,payrecord.payperiod.paydate');
										oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
										oSearch.rows = 200;
										oSearch.sort('payrecord.employee.contactpersontext', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.pays.totals.slips.show(oParam, data)})	
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0 )
										{
											aHTML.push('<table><tr class="ns1blankspace">' +
															'<td class="ns1blankspaceNothing">No pays</td>' +
															'</tr></table>');

											$('#ns1blankspacePayrollPaySlipTotalsColumn1').html(aHTML.join(''));
										}
										else
										{
											ns1blankspace.financial.payroll.data.pays = oResponse.data.rows;

											aHTML.push('<table id="ns1blankspacePayrollPaySlipTotals" class="ns1blankspace">' +
															'<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollPayTotalsSelectAll"></span></td>' +
															'<td class="ns1blankspaceHeaderCaption">First Name</td>' +
															'<td class="ns1blankspaceHeaderCaption">Last Name</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="color:#A0A0A0;">Number</td>' +
															'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
															'</tr>');
											
											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.payroll.pays.totals.slips.row(this));
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
										   {
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollPaySlipTotalsColumn1',
												xhtmlContext: 'Slips',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.financial.payroll.pays.totals.slips.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.pays.totals.slips.bind,
										   });

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2">');
													
											aHTML.push('<tr><td><span id="ns1blankspacePayrollPayTotalsPreview" class="ns1blankspaceAction" style="text-align:left;">' +
															'Pay Slips</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsPreviewStatus" style="padding-top:5px; padding-bottom:12px; font-size:0.75em;" class="ns1blankspaceSub">' +
														'Create pay slips for selected employees</td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsEmailContainer"><span id="ns1blankspacePayrollPayTotalsEmail" class="ns1blankspaceAction">' +
															'Email</span></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsPreviewStatus" style="padding-left:2px; padding-top:12px; padding-bottom:4px; font-size:0.75em;" class="ns1blankspaceSub">' +
																'<div style="border-left-style:solid; border-left-width:1px; border-left-color:red;">' +
																'&nbsp;= no email</div></td></tr>');

											aHTML.push('<tr><td id="ns1blankspacePayrollPayTotalsEmailStatus" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollPaySlipTotalsColumn2').html(aHTML.join(''));
											
											$('#ns1blankspacePayrollPayTotalsPreview').button(
											{
												label: 'Pay Slips',
												icons:
												{
													primary: "ui-icon-document"
												}
											})
											.click(function()
											{	
												ns1blankspace.financial.payroll.pays.totals.slips.preview.init(oParam)
											})
											.css('width', '100px');

											$('#ns1blankspacePayrollPayTotalsEmail').button(
											{
												label: 'Email',
												icons:
												{
													primary: "ui-icon-mail-open"
												}
											})
											.click(function()
											{	
												oParam = {onCompleteWhenCan: ns1blankspace.financial.payroll.pays.totals.slips.email.init};
												ns1blankspace.financial.payroll.pays.totals.slips.preview.init(oParam);
											})
											.css('width', '100px')
											.css('text-align', 'left');

											ns1blankspace.financial.payroll.pays.totals.slips.check();
										}	    	
									}
								},

					row: 		function (oRow)
								{
									var sKey = oRow.id;									
									var aHTML = [];

									aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollPayTotals_container-' + sKey + '">' +
																	'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollPayTotals_selectContainer-' + sKey + '"');

									if (oRow["payrecord.employee.contactperson.email"] == '')
									{
										aHTML.push('style="border-left-style:solid; border-left-width:1px; border-left-color:red;"')
									}	

									aHTML.push('><input type="checkbox" checked="checked" id="ns1blankspacePayrollPayTotals_select-' + sKey + '" /></td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_firstname" class="ns1blankspaceRow">' +
													oRow["payrecord.employee.contactperson.firstname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_surname" class="ns1blankspaceRow">' +
													oRow["payrecord.employee.contactperson.surname"] + '</td>');

									aHTML.push('<td id="ns1blankspacePayrollPayTotals_employeenumber" class="ns1blankspaceRow ns1blankspaceSub">' +
													oRow["payrecord.employee.employeenumber"] + '</td>');

									aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
													'<span style="margin-right:5px;" id="ns1blankspacePayrollPayTotals_option_preview-' + sKey + '"' +
																	' class="ns1blankspaceRowPreview"></span>' +		
													'</td></tr>');
									
									return aHTML.join('');
								},

					bind: 	function ()
								{
									$('.ns1blankspacePayrollPayTotalsSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspacePayrollPaySlipTotals input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');		
								},

					preview: {
									init: 	function (oParam)
												{
													//ns1blankspace.financial.payroll.pays.totals.slips.preview.show
													oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.payroll.pays.totals.slips.preview.payTotal);
													oParam = ns1blankspace.util.setParam(oParam, 'template', 'payslip');
													oParam = ns1blankspace.util.setParam(oParam, 'object', 371);
													ns1blankspace.format.templates.init(oParam);
												},

                                    payTotal: function (oParam)
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
													oSearch.addField('employee,' +
                                                                        'sum(grosssalary) grosssalaryytd,' +
                                                                        'sum(netsalary) netsalaryytd,' +
                                                                        'sum(deductions) deductionsytd,' +
                                                                        'sum(allowances) allowancesytd,' +
                                                                        'sum(superannuation) superannuationytd,' +
                                                                        'sum(taxbeforerebate) taxbeforerebateytd,' +
                                                                        'sum(taxadjustments) taxadjustmentsytd',
                                                                        'sum(posttaxsuper) posttaxsuperytd',
                                                                        'sum(pretaxsuper) pretaxsuperytd',
                                                                        'sum(rebate) rebateytd',
                                                                        'sum(taxafterrebate) taxafterrebateytd',
                                                                        );

                                                    var oPayPeriod = ns1blankspace.objectContextData;

                                                    var dStartDate = moment(oPayPeriod.paydate, 'D MMM YYYY');
                                                    var sStartofFinancialYear = ns1blankspace.financial.data.settings.endoffinancialyear; //30 Jun
                                                    if (sStartofFinancialYear == '') {sStartofFinancialYear = '30 Jun'}
                                                    var sPayPeriodStartOfFinancialYear = sStartofFinancialYear + ' ' + dStartDate.year();

                                                    var dPayPeriodStartOfFinancialYear = moment(sPayPeriodStartOfFinancialYear, 'D MMM YYYY').add(1, 'day');
                                                    if (moment().isBefore(dPayPeriodStartOfFinancialYear))
                                                    {
                                                        dPayPeriodStartOfFinancialYear = dPayPeriodStartOfFinancialYear.add(-1, 'year')
                                                    }

                                                    sPayPeriodStartOfFinancialYear = dPayPeriodStartOfFinancialYear.format('D MMM YYYY');

                                                    oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sPayPeriodStartOfFinancialYear);	
                                                    oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', oPayPeriod.paydate);	
                                                                       
													oSearch.rows = 9999;

													oSearch.getResults(function(oResponse)
													{
														var oLeaveType;
														var aLeave;

														_.each(ns1blankspace.financial.payroll.data.pays, function (oPay)
														{	
															oEmployeePay = _.find(oResponse.data.rows, function (oRow) {return oPay['payrecord.employee.id'] == oRow['employee']})
															
                                                            oPay['payrecord.grosssalaryytd'] = 0;
                                                            oPay['payrecord.netsalaryytd'] = 0;
                                                            oPay['payrecord.deductionsytd'] = 0;
                                                            oPay['payrecord.allowancesytd'] = 0;
                                                            oPay['payrecord.superannuationytd'] = 0;
                                                            oPay['payrecord.taxbeforerebateytd'] = 0;
                                                            oPay['payrecord.taxadjustmentsytd'] = 0;
                                                            oPay['payrecord.posttaxsuperytd'] = 0;
                                                            oPay['payrecord.pretaxsuperytd'] = 0;
                                                            oPay['payrecord.rebateytd'] = 0;
                                                            oPay['payrecord.taxafterrebateytd'] = 0;

															if (oEmployeePay != undefined)
															{
                                                                oPay['payrecord.grosssalaryytd'] = oEmployeePay['grosssalaryytd'];
                                                                oPay['payrecord.netsalaryytd'] = oEmployeePay['netsalaryytd'];
                                                                oPay['payrecord.deductionsytd'] = oEmployeePay['deductionsytd'];
                                                                oPay['payrecord.allowancesytd'] = oEmployeePay['allowancesytd'];
                                                                oPay['payrecord.superannuationytd'] = oEmployeePay['superannuationytd'];
                                                                oPay['payrecord.taxbeforerebateytd'] = oEmployeePay['taxbeforerebateytd'];
                                                                oPay['payrecord.taxadjustmentsytd'] = oEmployeePay['taxadjustmentsytd'];
                                                                oPay['payrecord.posttaxsuperytd'] = oEmployeePay['posttaxsuperytd'];
                                                                oPay['payrecord.pretaxsuperytd'] = oEmployeePay['pretaxsuperytd'];
                                                                oPay['payrecord.rebateytd'] = oEmployeePay['rebateytd'];
                                                                oPay['payrecord.taxafterrebateytd'] =oEmployeePay['taxafterrebateytd'];
															}
														});
													});

													ns1blankspace.financial.payroll.pays.totals.slips.preview.leaveTotal(oParam)
												},

									leaveTotal: function (oParam)
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_SEARCH';
													oSearch.addField('employee,type,sum(hours) hours');
													oSearch.rows = 9999;

													oSearch.getResults(function(oResponse)
													{
														var oLeaveType;
														var aLeave;

														_.each(ns1blankspace.financial.payroll.data.pays, function (oPay)
														{	
															aLeave = _.filter(oResponse.data.rows, function (oRow) {return oPay['payrecord.employee.id'] == oRow['employee']})
															
															oPay.leaveTotalAnnual = 0;
															oPay.leaveTotalSick = 0;
															oPay.leaveTotalLongService = 0;

															if (aLeave.length != 0)
															{
																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 1});
																if (oLeaveType != undefined) {oPay.leaveTotalAnnual = oLeaveType.hours};

																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 2});
																if (oLeaveType != undefined) {oPay.leaveTotalSick = oLeaveType.hours};

																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 3});
																if (oLeaveType != undefined) {oPay.leaveTotalLongService = oLeaveType.hours};
															}
														});
													});

													ns1blankspace.financial.payroll.pays.totals.slips.preview.leave(oParam)
												},

									leave: function (oParam)
												{
													var oSearch = new AdvancedSearch();
													oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_SEARCH';
													oSearch.addField('employee,type,sum(hours) hours');
													oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext);	
													oSearch.rows = 9999;

													oSearch.getResults(function(oResponse)
													{
														var oLeaveType;
														var aLeave;

														_.each(ns1blankspace.financial.payroll.data.pays, function (oPay)
														{	
															aLeave = _.filter(oResponse.data.rows, function (oRow) {return oPay['payrecord.employee.id'] == oRow['employee']})

															oPay.leaveAnnual = 0;
															oPay.leaveSick = 0;
															oPay.leaveLongService = 0;

															if (aLeave.length != 0)
															{
																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 1});
																if (oLeaveType != undefined) {oPay.leaveAnnual = oLeaveType.hours};

																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 2});
																if (oLeaveType != undefined) {oPay.leaveSick = oLeaveType.hours};

																oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 3});
																if (oLeaveType != undefined) {oPay.leaveLongService = oLeaveType.hours};
															}
														});
													});

													ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam)
												},

									show:		function (oParam)
												{
													var iStep = 1
													var iDataIndex = 0;
													var iDataItemIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.step != undefined) {iStep = oParam.step}
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
														if (oParam.dataItemIndex != undefined) {iDataItemIndex = oParam.dataItemIndex}
													}
													else
													{
														oParam = {}
													}			

													if (iStep == 1)
													{	
														ns1blankspace.financial.payroll.data.slips = [];

														if ($('#ns1blankspacePayrollPaySlipTotals input:checked').length > 0)
														{	
															$('#ns1blankspacePayrollPayTotalsPreviewStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
																		'<span id="ns1blankspacePayrollPayTotalsPreviewStatusIndex">1</span>/' + $('#ns1blankspacePayrollPaySlipTotals input:checked').length + 
																		'</span>');
														}
														else
														{
															ns1blankspace.status.error('No employees selected')
														}	

														$('#ns1blankspacePayrollPaySlipTotals input:checked').each(function() 
														{
															var sKey = (this.id).split('-')[1];

															var oData = $.grep(ns1blankspace.financial.payroll.data.pays, function (a) {return a.id == sKey;})[0]

															if (oData)
															{
																ns1blankspace.financial.payroll.data.slips.push(oData);
															}
														});

														oParam.step = 2;
														ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
													}	

													if (iStep == 2)
													{
														if (iDataIndex < ns1blankspace.financial.payroll.data.slips.length)
														{	
															$('#ns1blankspacePayrollPayTotalsPreviewStatusIndex').html(iDataIndex + 1);

															var oData = ns1blankspace.financial.payroll.data.slips[iDataIndex];

															if (oData.items !== undefined)
															{
																oParam.step = 2;
																oParam.dataIndex = iDataIndex + 1;
																ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).html(ns1blankspace.xhtml.loadingSmall)

																var oSearch = new AdvancedSearch();
																oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
																oSearch.addField('type,typetext,hours');
																oSearch.addSummaryField('sum(hours) hours');
																oSearch.addFilter('record', 'EQUAL_TO', oData.id);
																oSearch.rows = 100;
																oSearch.sort('type', 'asc')

																oSearch.getResults(function(oResponse)
																{
																	oParam.step = 2;
																	oParam.dataIndex = iDataIndex + 1;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].items = oResponse.data.rows;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].hours = oResponse.summary.hours;
																	ns1blankspace.financial.payroll.data.slips[iDataIndex].contactbusinesstext = ns1blankspace.user.contactBusinessText;
																	
																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).html('');
																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).addClass('ns1blankspaceRowPreviewDone');

																	$('#ns1blankspacePayrollPayTotals_option_preview-' + oData.id).button(
																	{
																		text: false,
																		icons:
																		{
																			primary: "ui-icon-document"
																		}
																	})
																	.click(function()
																	{
																		oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
																		ns1blankspace.financial.payroll.pays.totals.slips.preview.showHide(oParam);
																	})
																	.css('width', '15px')
																	.css('height', '20px');

																	ns1blankspace.financial.payroll.pays.totals.slips.preview.show(oParam);
																});
															}					
														}
														else
														{
															$('#ns1blankspacePayrollPayTotalsPreviewStatus').fadeOut(3000);
															delete oParam.dataIndex;
															ns1blankspace.util.onComplete(oParam);
														}	
													}						
												},

									showHide: 	function (oParam)
												{
													var sXHTMLElementID;
													var sKey;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sKey = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspacePayrollPayTotals_container_preview-' + sKey).length != 0)
													{
														$('#ns1blankspacePayrollPayTotals_container_preview-' + sKey).remove();
													}
													else
													{
														var sHTML = 'No preview';

														var oSlip = $.grep(ns1blankspace.financial.payroll.data.slips, function (a) {return a.id == sKey;})[0];

														if (oSlip !== undefined)
														{
															var oTemplate = ns1blankspace.format.templates.get(oParam);

															sHTML = ns1blankspace.format.render(
															{
																object: 371,
																objectContext: -1,
																xhtmlTemplate: oTemplate.xhtml,
																objectData: oSlip,
																objectOtherData: oSlip.items
															});

															oSlip.xhtml = sHTML;
														}	

														$('#ns1blankspacePayrollPayTotals_container-' + sKey).after('<tr id="ns1blankspacePayrollPayTotals_container_preview-' + sKey + '">' +
															'<td colspan=5><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
													}
												}			
								},

					email: 		{
									init: 		function (oParam, oResponse)
												{
													oParam = ns1blankspace.util.setParam(oParam, 'dataIndex', 0)
													ns1blankspace.financial.payroll.pays.totals.slips.preview.init(
													{
														onCompleteWhenCan: ns1blankspace.financial.payroll.pays.totals.slips.email.send
													})
													
													//ns1blankspace.financial.payroll.pays.totals.slips.email.send({dataIndex: 0})
												},

									send:		function (oParam)
												{		
													var iDataIndex = 0;

													if (oParam != undefined)
													{	
														if (oParam.dataIndex != undefined) {iDataIndex = oParam.dataIndex}
													}
													else
													{
														oParam = {dataIndex: 0}
													}			
																	
													if (iDataIndex < ns1blankspace.financial.payroll.data.slips.length)
													{
														$('#ns1blankspacePayrollPayTotalsEmailStatus').html('<span style="font-size:2.25em;" class="ns1blankspaceSub">' +
															'<span id="ns1blankspacePayrollPayTotalsEmailStatusIndex">' + (iDataIndex + 1) + '</span>/' + ns1blankspace.financial.payroll.data.slips.length + 
															'</span>');

														ns1blankspace.debug.message(ns1blankspace.financial.payroll.data.slips[iDataIndex]);

														var oSlip = ns1blankspace.financial.payroll.data.slips[iDataIndex];

														if (oSlip !== undefined)
														{
															if (oSlip['payrecord.employee.contactperson.email'] == '')
															{
																$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('No Email');
																oParam.dataIndex = iDataIndex + 1;
																oParam.step = 2;
																ns1blankspace.financial.payroll.pays.totals.slips.email.send(oParam);
															}	
															else
															{
																$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html(ns1blankspace.xhtml.loadingSmall);

																if (oSlip.xhtml === undefined)
																{
																	var oTemplate = ns1blankspace.format.templates.get(oParam);

																	oSlip.xhtml = ns1blankspace.format.render(
																	{
																		object: 371,
																		objectContext: -1,
																		xhtmlTemplate: oTemplate.xhtml,
																		objectData: oSlip,
																		objectOtherData: oSlip.items
																	});
																}

                                                                var fromemail = ns1blankspace.financial.data.settings.messagingaccounttext;
                                                                if (fromemail == '')
                                                                {
                                                                    fromemail = ns1blankspace.user.email;
                                                                }

																var oData = 
																{
																	subject: ns1blankspace.user.contactBusinessText + ' Pay Slip - ' + ns1blankspace.objectContextData.paydate,
																	message: oSlip.xhtml,
																	to: oSlip['payrecord.employee.contactperson'],
																	object: 37,
																	objectContext: ns1blankspace.objectContext,
																	fromemail: fromemail
																}

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: function (data)
																	{
																		if (data.status == 'OK')
																		{
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('Emailed');
																			oParam.dataIndex = iDataIndex + 1;
																			oParam.step = 2;
																			ns1blankspace.financial.payroll.pays.totals.slips.email.send(oParam);
																		}
																		else
																		{
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).html('Error');
																			$('#ns1blankspacePayrollPayTotals_selectContainer-' + oSlip.id).attr('title', data.error.errornotes);
																		}
																	}
																});
															}	
														}
													}
													else
													{
														$('#ns1blankspacePayrollPayTotalsEmailStatus').fadeOut(3000);
														ns1blankspace.util.onComplete(oParam);
													}	
												}																	
								}			
				}	
}

ns1blankspace.financial.payroll.util = 
{
	linetypes: 	{
					data: 		[
									{
										key: 'allowancesnontaxable',
										title: 'Allowances (Non-taxable)',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'allowancestaxable',
										title: 'Allowances (Taxable)',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'deductions',
										title: 'Deductions',
										selectable: true,
										dependant: false,
										hours: false
									},
									{
										key: 'grosssalary',
										title: 'Gross Salary',
										selectable: true,
										dependant: true,
										hours: false
									},
									{
										key: 'leave',
										title: 'Leave',
										selectable: true,
										dependant: true,
										hours: false
									},
									{
										key: 'leaveloading',
										title: 'Leave Loading',
										selectable: false,
										dependant: true,
										hours: false
									},
									{
										key: 'leavetype',
										title: 'Leave Type',
										selectable: true,
										dependant: true,
										options:
										[
											{
												id: 1,
												title: 'Annual'
											},
											{
												id: 2,
												title: 'Sick'
											},
											{
												id: 3,
												title: 'Long Service'
											},
											{
												id: 4,
												title: 'Leave Without Pay'
											},
										]
									},
									{
										key: 'posttaxsuper',
										title: 'Post Tax Superannuation',
										selectable: false,
										dependant: true
									},
									{
										key: 'salarysacrificesuper',
										title: 'Salary Sacrificed Superannuation',
										selectable: false,
										dependant: true
									},
									{
										key: 'standardhours',
										title: 'Standard Hours',
										selectable: true,
										dependant: false,
										hours: true
									},
									{
										key: 'super',
										title: 'Superannuation',
										selectable: true,
										dependant: true
									},
									{
										key: 'taxadjustments',
										title: 'Tax Adjustments',
										selectable: true,
										dependant: false,
										hours: false
									}
								],

					init:		function (oParam)
								{
									if (ns1blankspace.financial.payroll.data.linetypes != undefined)
									{
										ns1blankspace.util.onComplete(oParam);
									}
									else
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_PAYROLL_LINE_TYPE_SEARCH';		
										oSearch.addField('includeinallowancesnontaxable,includeinallowancestaxable,includeindeductions,includeingrosssalary,' +
															'includeinleave,includeinleaveloading,includeinleavetype,includeinleavetypetext,includeinposttaxsuper,' +
															'includeinsalarysacrificesuper,includeinstandardhours,includeinsuper,includeintaxadjustments,notes,title');
										oSearch.rows = 100;
										oSearch.sort('title', 'asc');
										oSearch.getResults(function(oResponse)
										{
											ns1blankspace.financial.payroll.data.linetypes = oResponse.data.rows;
											ns1blankspace.util.onComplete(oParam);
										});
									}	
								},

					search:		function (oParam)
								{
									var sIncludeIn = ns1blankspace.util.getParam(oParam, 'includeIn').value;
                                    var sText = ns1blankspace.util.getParam(oParam, 'text').value;
									var aLineType = ns1blankspace.financial.payroll.data.linetypes;
                                    var bIDs = ns1blankspace.util.getParam(oParam, 'ids', {default: false}).value;

									if (sIncludeIn != undefined)
									{	
										var aLineType = $.grep(aLineType, function (linetype) {return linetype['includein' + sIncludeIn.toLowerCase()] == 'Y'});
                                    }

                                    if (sText != undefined)
									{	
										var aLineType = $.grep(aLineType, function (linetype) {return _.includes(linetype['title'], sText)});
                                    }

                                    if (bIDs)
                                    {
                                        aLineType = _.map(aLineType, 'id');
                                    }

									return aLineType
								},					

					get:		function (oParam)
								{
									var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;
									var sID = ns1blankspace.util.getParam(oParam, 'id').value;
									var aLineTypes = ns1blankspace.util.getParam(oParam, 'lineTypes', {"default": ns1blankspace.financial.payroll.data.linetypes}).value;
									if (aLineTypes == undefined) {aLineTypes = ns1blankspace.setup.financial.payroll.data.linetypes}

									if (sTitle != undefined)
									{	
										aLineTypes = $.grep(aLineTypes, function (linetype) {return linetype.title == sTitle});
									}

									if (sID != undefined)
									{	
										aLineTypes = $.grep(aLineTypes, function (linetype) {return linetype.id == sID});										
									}	

									return aLineTypes[0]
								},

					showHide:	function (oParam)
								{
									var iLineType = ns1blankspace.util.getParam(oParam, 'lineType').value;
									if (iLineType==undefined) {iLineType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value};

									$('.includein').hide();
									$vq.show('#ns1blankspaceItemEditAbout', '');

									if (iLineType != undefined)
									{	
										var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({id: iLineType});
										var aIncludeIn = ns1blankspace.financial.payroll.util.linetypes.includeIn({id: iLineType});
										var aIncludeInInDependant = $.grep(aIncludeIn, function (i) {return !i.dependant});
										var sHours = 'N';

										if (aIncludeInInDependant.length > 0)
										{	
											sHours = (aIncludeInInDependant[0].hours?'Y':'N');					
										}

										$('.includeinhours' + sHours).show();
										$('.includein :visible :first').focus();

										if ($('#ns1blankspaceItemEditAbout').length != 0)
										{
											$vq.clear({queue: 'edit-about'});

											$vq.add('<div class="ns1blankspaceCaption" style="padding-top:22px; padding-left:0px;">Included in</div>', {queue: 'edit-about'});

											$.each(aIncludeIn, function (i, include)
											{
												$vq.add('<div class="ns1blankspaceSubNote" style="font-size:0.75em; padding-left:0px; padding-top:4px;"' +
																' id="ns1blankspaceItemEditAbout-' + include.key + '">' + include.title + '</div>', {queue: 'edit-about'});
											});

											$.each(aIncludeIn, function (i, include)
											{
												if (include.title == 'Deductions')
												{
													$vq.add('<div class="ns1blankspaceSubNote" style="font-size:0.75em; padding-left:0px; padding-top:8px; color:#a94442;"' +
																' id="ns1blankspaceItemEditAbout-' + include.key + '-AdditionalInfo">' +
																	'For deductions you must set additional information as "F" (Fees), "W" (Workplace Giving), "G" (Child Support Garnish) or "D" (Child Support Deduction)'
																+ '</div>', {queue: 'edit-about'});
												}

												if (include.key == 'allowancestaxable')
												{
													$vq.add('<div class="ns1blankspaceSubNote" style="font-size:0.75em; padding-left:0px; padding-top:8px; color:#a94442;"' +
																' id="ns1blankspaceItemEditAbout-' + include.key + '-AdditionalInfo">' +
																	'For allowances you must set additional information as ' +
																	'"CD" (Cents per Kilometre), ' +
																	'"AD" (Award Transport Payments), ' +
																	'"LD" (Laundry), ' +
																	'"RD" (Domestic or Overseas Travel Allowances and Overseas Accommodation Allowances), ' +
																	'"TD" (Tool Allowances), ' +
																	'"OD" (Other Allowances), ' +
																	'"KN" (Task Allowances) & ' +
																	'"QN" (Qualification Allowances) ' +
																'</div>', {queue: 'edit-about'});
												}
											});

											$vq.render('#ns1blankspaceItemEditAbout', {queue: 'edit-about'});
										}	
									}	
								},

					includeIn:	function (oParam)
								{
									var iLineType = ns1blankspace.util.getParam(oParam, 'id').value;
									var bSelectableOnly = ns1blankspace.util.getParam(oParam, 'selectableOnly', {"default": true}).value;

									var oLineType = ns1blankspace.financial.payroll.util.linetypes.get({id: iLineType});
									var aIncludeIn = [];
									var oKey;

									if (oLineType != undefined)
									{
										for (var key in oLineType)
								  		{
								     		if (oLineType.hasOwnProperty(key))
								     		{
								     			if (oLineType[key] == 'Y')
								     			{
								     				oKey = $.grep(ns1blankspace.financial.payroll.util.linetypes.data, function (type) {return type.key == key.replace('includein', '')})[0];
								     				if (oKey != undefined)
								     				{	
								     					aIncludeIn.push(oKey);
								     				}	
								     			}	
								     		}
								     	}
									}

									return aIncludeIn
								}
				}			
}							

ns1blankspace.financial.payroll.superannuation =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.financial.payroll.superannuation.urls(
					{
						onComplete: ns1blankspace.financial.payroll.superannuation.providers,
						onCompleteWhenCan: ns1blankspace.financial.payroll.superannuation.expenses
					});
				},

	summary:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						ns1blankspace.financial.payroll.superannuation.data.summary = [];

						var aContactBusiness = _.map(ns1blankspace.financial.payroll.superannuation.data.providers, 'supercontactbusiness');
						aContactBusiness.push(ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description');
						oSearch.addFilter('paystatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
						oSearch.addFilter('contactbusinesspaidto', 'IN_LIST', aContactBusiness.join(','));

						var sSearchText = ns1blankspace.financial.payroll.superannuation.data.searchText;
						var sSearchDate = ns1blankspace.financial.payroll.superannuation.data.searchDate;

						if (sSearchText != undefined && sSearchText != '')
						{
							oSearch.addBracket('(');
							oSearch.addFilter('contactpersonpaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('contactbusinesspaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						if (sSearchDate != undefined && sSearchDate != '')
						{
							oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', sSearchDate);
						}

						oSearch.rows = 10000;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.summary(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.superannuation.data.summary = oResponse.data.rows;

						ns1blankspace.financial.payroll.superannuation.data.summaryReduced = _.groupBy(
								ns1blankspace.financial.payroll.superannuation.data.summary, function (summary)
								{
									return _.last(_.split(_.first(_.split(summary.description, ' -')), 'for '))
								})

						var aHTML = [];

						_.each(ns1blankspace.financial.payroll.superannuation.data.summaryReduced, function (values, key)
						{
							if (key != '')
							{
								aHTML.push('<div class="ns1blankspaceSubNote">' + key + '</div>' + 
												'<div class="ns1blankspaceSubNote" style="font-weight:600; padding-bottom:6px;">' + numeral(_.sum(_.map(values, function (v) {return numeral(v.outstandingamount).value()}))).format('(0,0.00)') + '</div>');
							}
						});

						$('#ns1blankspacePayrollSuperannuationExpenseTotals').html(aHTML.join(''));
					}	
				},			

	expenses:	function (oParam, oResponse)
				{
					var iSearchBankAccount = ns1blankspace.util.getParam(oParam, 'searchBankAccount', {"default": -1}).value;
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;
					var oSearchDate = ns1blankspace.util.getParam(oParam, 'searchDate');
					var sSearchDate;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.financial.payroll.superannuation.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.financial.payroll.superannuation.data.searchText;
					}

					if (oSearchDate.exists)
					{
						sSearchDate = oSearchDate.value;
						ns1blankspace.financial.payroll.superannuation.data.searchDate = sSearchDate;
					}
					else
					{	
						sSearchDate = ns1blankspace.financial.payroll.superannuation.data.searchDate;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn1"></td>' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSuperannuation').html(aHTML.join(''));

						$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.financial.payroll.superannuation.data.expenses = [];

						var aContactBusiness = _.map(ns1blankspace.financial.payroll.superannuation.data.providers, 'supercontactbusiness');
						aContactBusiness.push(ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description,contactbusinesspaidto,contactbusinesspaidtotext,contactpersonpaidto,contactpersonpaidtotext,accrueddate');
						oSearch.addFilter('paystatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
						oSearch.addFilter('contactbusinesspaidto', 'IN_LIST', aContactBusiness.join(','));

						if (sSearchText != undefined && sSearchText != '')
						{
							oSearch.addBracket('(');
							oSearch.addFilter('contactpersonpaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('contactbusinesspaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						if (iSearchBankAccount != -1)
						{
							oSearch.addFilter('bankaccount', 'EQUAL_TO', iSearchBankAccount);
						}

						if (sSearchDate != undefined && sSearchDate != '')
						{
							oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', sSearchDate);
						}

						oSearch.addSummaryField('sum(amount) totalamount');
						oSearch.addSummaryField('min(accrueddate) startdate');
						oSearch.addSummaryField('max(accrueddate) enddate');

						oSearch.rows = 100;
						oSearch.sort('accrueddate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.expenses(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceInvoicingUnsent">' +
											'<tr><td class="ns1blankspaceSub">No outstanding superannuation expenses.</td></tr></table>');

							$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html('');
						}
						else
						{
							var iPaymentAccount = ns1blankspace.util.getParam(oParam, 'paymentAccount').value;

							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						
							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePayrollSuperannuationExpense" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Fund</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:50px; text-align:right;">Amount</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:70px; text-align:right;">Due Date</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:25px; text-align:right;">&nbsp;</td>' +
										'</tr>');

							//'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollSuperannuationExpenseSelectAll"></span></td>' +

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.payroll.superannuation.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspacePayrollSuperannuationExpenseColumn1',
							xhtmlContext: 'PayrollSuperannuationExpense',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.payroll.superannuation.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.payroll.superannuation.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceSubNote" style="padding-top:6px;">' +
											'Description contains' +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceText" style="padding-top:0px;">' +
											'<input id="ns1blankspacePayrollSuperannuationExpenseSearchText" data-1blankspace="ignore" class="ns1blankspaceText" style="width:130px;">' +
											'</td></tr>');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
											'<td class="ns1blankspaceSubNote">' +
											'Due date on or before' +
											'</td></tr>' +
											'<tr><td class="ns1blankspaceDate" style="padding-top:0px;">' +
											'<input id="ns1blankspacePayrollSuperannuationExpenseSearchDate" data-1blankspace="ignore" class="ns1blankspaceDate" style="width:130px;">' +
											'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspacePayrollSuperannuationExpenseSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspacePayrollSuperannuationExpenseSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('<tr><td style="padding-top:15px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Expenses total</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotal" style="padding-top:0px; font-size:1.2em; padding-bottom:0px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:6px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Start date</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseStartDate" style="padding-top:0px; font-size:1.2em; padding-bottom:0px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:6px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'End date</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseEndDate" style="padding-top:0px; font-size:1.2em; padding-bottom:16px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotals" style="padding-top:0px; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseURLs" style="padding-top:0px; font-size:1em; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');

							aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseBanks" style="padding-top:0px; font-size:1em; padding-bottom:12px;" class="ns1blankspaceSub">' +
										'</td></tr>');
						
						aHTML.push('</table>');

						if ($('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').length == 0)
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').before(aHTML.join(''));
						}

						ns1blankspace.util.initDatePicker({select: '#ns1blankspacePayrollSuperannuationExpenseSearchDate'});

						$('#ns1blankspacePayrollSuperannuationExpenseSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val());
							oParam = ns1blankspace.util.setParam(oParam, 'searchDate', $('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val());
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', '');
							oParam = ns1blankspace.util.setParam(oParam, 'searchDate', '');
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val());
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchDate', $('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val());
					    		ns1blankspace.financial.payroll.superannuation.expenses(oParam);
					    	}
						});				

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').val(sSearchText);
						$('#ns1blankspacePayrollSuperannuationExpenseSearchDate').val(sSearchDate);

						if (ns1blankspace.financial.payroll.data.urls.superannuation.length != 0)
						{
							$('#ns1blankspacePayrollSuperannuationExpenseURLs').html(
								'<div style="font-size:0.75em;">Submit using...</div>' +
								_.join(_.map(ns1blankspace.financial.payroll.data.urls.superannuation, function (provider)
								{
									return '<div><a style="font-size:0.875em;" href="' + (provider.url.indexOf('http')==-1?'http://':'') + provider.url + '" target="_blank" title="' + provider.urllogon + '">' +
										 provider.title + '</a></div>'
								}), '')
							)
						}

						ns1blankspace.financial.payroll.superannuation.summary();
						ns1blankspace.financial.payroll.superannuation.refresh(
						{
							total: oResponse.summary.totalamount,
							startdate: oResponse.summary.startdate,
							enddate: oResponse.summary.enddate
						});

						ns1blankspace.financial.payroll.superannuation.banks();
					}
				},

	banks:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var bankAccounts = _.filter(ns1blankspace.financial.data.bankaccounts, function (bankAccount)
						{
							return (bankAccount.bank != '')
						});

						bankAccounts = _.map(bankAccounts, function (bankAccount)
						{
							return bankAccount.bank
						});

						if (bankAccounts.length != 0)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_URL_SEARCH';		
							oSearch.addField('title,url');
							oSearch.addFilter('title', 'IN_LIST', bankAccounts.join(','));
							oSearch.addFilter('url', 'TEXT_IS_NOT_EMPTY');
							oSearch.sort('private', 'desc');
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.banks(oParam, data)});
						}	
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length != 0)
						{
							aHTML.push('<table style="margin-top:0px;">');

							aHTML.push('<tr><td class="ns1blankspaceSub" style="padding-left:0px; padding-top:10px; font-size:0.75em;">Pay using ...</td></tr>')
										
							$.each(oResponse.data.rows, function (r, oRow)
							{
								aHTML.push('<tr><td style="padding-left:0px; font-size:0.825em; padding-top:0px; padding-bottom:6px;"><a href="' + (oRow.url.indexOf('http')==-1?'http://':'') + oRow.url + '" target="_blank">' +
										 oRow.title + '</a></td></tr>');
							});

							aHTML.push('</table>')

							$('#ns1blankspacePayrollSuperannuationExpenseBanks').html(aHTML.join(''));
						}
					}
				},						

	refresh: function (oParam)
				{
					var cTotal = ns1blankspace.util.getParam(oParam, 'total').value;
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startdate').value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'enddate').value;

					var sTotal = ns1blankspace.option.currencySymbol + numeral(cTotal).format('(0,0.00)');
					$('#ns1blankspacePayrollSuperannuationExpenseTotal').html(sTotal);

					$('#ns1blankspacePayrollSuperannuationExpenseStartDate').html(moment(sStartDate, ns1blankspace.option.dateFormats).format('D MMM YYYY'));
					$('#ns1blankspacePayrollSuperannuationExpenseEndDate').html(moment(sEndDate, ns1blankspace.option.dateFormats).format('D MMM YYYY'));
				},						

	row: 		function (oRow)	
				{
					var aHTML = [];

					oRow.hasEmail = false;
					
					var sContact = oRow['contactbusinesspaidtotext'];
					if (sContact == '') {sContact = oRow['contactpersonpaidtotext']}

					ns1blankspace.financial.payroll.superannuation.data.expenses.push(oRow);

					aHTML.push('<tr class="ns1blankspaceRow">');

					/*				'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollSuperannuationExpense_selectContainer-' + oRow["id"] + '">' +
									'<input type="checkbox" checked="checked" id="ns1blankspacePayrollSuperannuationExpense_select-' + oRow["id"] + '"' + 
									' title="' + oRow["reference"] + '"' +
									' data-outstandingamount="' + oRow["outstandingamount"].replace(',', '') + '" /></td>');
					*/

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										sContact + '</td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									'<div>' + oRow["description"] + '</div><div class="ns1blankspaceSubNote">' + oRow["reference"] + '</div></td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow["outstandingamount"] + '</td>'); 

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_paymentduedate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
									ns1blankspace.util.fd(oRow["accrueddate"]) + '</td>');

					aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">');

					aHTML.push('<span style="margin-right:5px;" id="ns1blankspacePayrollSuperannuationExpense_option_preview-' + oRow['id'] + '"' +
									' class="ns1blankspaceRowPreview"></span>');

					aHTML.push('<span id="ns1blankspacePayrollSuperannuationExpense_option-' + oRow['id'] + '-1"' +
									' class="ns1blankspaceRowView"></span></td>');
					aHTML.push('</tr>');


					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspacePayrollSuperannuationExpense .ns1blankspaceRowView').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function()
					{
						ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px');

					$('.ns1blankspacePayrollSuperannuationExpenseSelectAll').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function()
					{	
						$('#ns1blankspacePayrollSuperannuationExpense input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
						ns1blankspace.financial.payroll.superannuation.refresh();
					})
					.css('width', '14px');

					$('#ns1blankspacePayrollSuperannuationExpense input:checked').click(function()
					{	
						ns1blankspace.financial.payroll.superannuation.refresh();
						ns1blankspace.financial.payroll.superannuation.summary();
					})

					//ns1blankspace.financial.payroll.superannuation.refresh();			
				},

	urls:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_URL_SEARCH';		
						oSearch.addField('title,notes,url,urllogon');
						oSearch.addBracket('(')
						oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Superannuation');
						oSearch.addOperator('or')
						oSearch.addFilter('notes', 'TEXT_IS_LIKE', 'Superannuation');
						oSearch.addOperator('or')
						oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Workers Insurance');
						oSearch.addOperator('or')
						oSearch.addFilter('notes', 'TEXT_IS_LIKE', 'Workers Insurance');
						oSearch.addBracket(')')
						oSearch.sort('private', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.urls(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.data.urls = 
						{
							superannuation: _.filter(oResponse.data.rows, function (row)
							{
								return (_.includes(row.title.toLowerCase(), 'superannuation') || _.includes(row.notes.toLowerCase(), 'superannuation'))
							}),

							insurance: _.filter(oResponse.data.rows, function (row)
							{
								return (_.includes(row.title.toLowerCase(), 'workers insurance') || _.includes(row.notes.toLowerCase(), 'workers insurance'))
							})
						}

						ns1blankspace.util.onComplete(oParam);
					}
				},

	providers:	
				function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
						oSearch.addField('supercontactbusiness');
						oSearch.addFilter('supercontactbusiness', 'IS_NOT_NULL');
						oSearch.rows = 1000;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.providers(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.superannuation.data.providers = oResponse.data.rows;
						ns1blankspace.util.onComplete(oParam);
					}
				}			
}

ns1blankspace.financial.payroll.insurance =
{
	data: 	{},

	init: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.endPoint = 'contact';
						oSearch.method = 'CONTACT_BUSINESS_SEARCH';
						oSearch.addField( 'tradename,legalname,abn,streetcountry');						
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.user.contactBusiness);
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.insurance.init(oParam, data)}) 
					}
					else
					{
						ns1blankspace.financial.payroll.insurance.data.contactBusiness = oResponse.data.rows[0];
						ns1blankspace.financial.payroll.insurance.show(oParam)
					}
				},

	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollInsuranceColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn2" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn3" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspacePayrollInsuranceColumn4" style="font-size: 0.925em; padding-left:10px; width:100px;"></td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainInsurance').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace" style="width:100%;">');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollInsuranceStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollInsuranceEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollInsuranceRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:26px;" id="ns1blankspacePayrollInsuranceNotes">' +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollInsuranceColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspacePayrollInsuranceRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.insurance.init(
							{
								startDate: $('#ns1blankspacePayrollInsuranceStartDate').val(),
								endDate: $('#ns1blankspacePayrollInsuranceEndDate').val()
							})
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">')
						
						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.tradename != '')
						{
							aHTML.push('<tr><td style="text-align:left;" class="ns1blankspaceCaption">Trade Name</td></tr>' +
								'<tr><td style="text-align:left;" data-id="' + ns1blankspace.financial.payroll.insurance.data.contactBusiness.id + '" data-object="contactBusiness" class="ns1blankspaceViewLink">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.tradename +
								'</td></tr>');
						}

						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.legalname != '')
						{
							aHTML.push('<tr><td style="text-align:left;  padding-top:10px;" class="ns1blankspaceCaption">Legal Name</td></tr>' +
								'<tr><td style="text-align:left;">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.legalname + 
								'</td></tr>');
						}

						if (ns1blankspace.financial.payroll.insurance.data.contactBusiness.abn != '')
						{
							aHTML.push('<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">ABN</td></tr>' +
								'<tr><td style="text-align:left;">' +
								ns1blankspace.financial.payroll.insurance.data.contactBusiness.abn +
								'</td></tr>');
						}

						aHTML.push('</table>');

						$('#ns1blankspacePayrollInsuranceColumn2').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">')

						if (ns1blankspace.option.employeeInsuranceURL != undefined && ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase() != '')
						{
							if (ns1blankspace.option.employeeInsuranceURL[ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase()] != undefined)
							{	
								aHTML.push('<tr><td style="text-align:left;">' +
									'<a href="' + ns1blankspace.option.employeeInsuranceURL[ns1blankspace.financial.payroll.insurance.data.contactBusiness.streetcountry.toLowerCase()] + '" target="_blank">' +
									'<span style="font-size:0.825em;">Find out more about employee insurance obligations...</span></a>' +
									'</td></tr>');
							}
						}

						if (ns1blankspace.financial.payroll.data.urls.insurance.length != 0)
						{
							aHTML.push('<tr><td style="text-align:left; padding-top:16px;">' +
								'<div class="ns1blankspaceSubNote">Manage your insurance using...</div>' +
								_.join(_.map(ns1blankspace.financial.payroll.data.urls.insurance, function (provider)
								{
									return '<div><a style="font-size:0.875em;" href="' + (provider.url.indexOf('http')==-1?'http://':'') + provider.url + '" target="_blank" title="' + provider.urllogon + '">' +
										 provider.title + '</a></div>'
								}), '')
							);

							aHTML.push('</td></tr>');
						}

						aHTML.push('</table>');

						$('#ns1blankspacePayrollInsuranceColumn4').html(aHTML.join(''));
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate,sum(taxadjustments) taxadjustments');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						
						if (sStartDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollInsuranceStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollInsuranceEndDate').val(sEndDate);
						}

						oSearch.sort('payrecord.employee.contactperson', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.insurance.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.financial.payroll.insurance.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +		
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +
							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total Payroll</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollInsuranceColumn3').html(aHTML.join(''));
					}	
				}
}

ns1blankspace.financial.payroll.dashboard =
{
	data: 	{},

	init: 	function (oParam)
				{	
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
							'<tr>' +
							'<td id="ns1blankspacePayrollDashboardColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
							'<td id="ns1blankspacePayrollDashboardColumn2" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspacePayrollDashboardColumn3" class="ns1blankspaceColumn1Divider" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspacePayrollDashboardColumn4" style="font-size: 0.925em; padding-left:10px; width:100px;"></td>' +
							'</tr>' +
							'</table>');	

					$('#ns1blankspaceMainDashboard').html(aHTML.join(''));	

					var aHTML = [];
					
					aHTML.push('<table class="ns1blankspace" style="width:100%;">');
					
					aHTML.push('<tr>' +
									'<tr><td class="ns1blankspaceDate">' +
									'<input id="ns1blankspacePayrollDashboardStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
									'</td></tr>');
						
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
									'To' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceDate">' +
									'<input id="ns1blankspacePayrollDashboardEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
									'</td></tr>');
													
					aHTML.push('<tr><td style="padding-top:5px;">' +
									'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspacePayrollDashboardRefresh">Refresh</span>' +
									'</td></tr>');

					aHTML.push('<tr><td style="padding-top:26px;" id="ns1blankspacePayrollDashboardNotes">' +
									'</td></tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspacePayrollDashboardColumn1').html(aHTML.join(''));

					ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

					$('#ns1blankspacePayrollDashboardRefresh').button(
					{
						label: 'Refresh'
					})
					.click(function()
					{
						ns1blankspace.financial.payroll.dashboard.refresh(
						{
							startDate: $('#ns1blankspacePayrollDashboardStartDate').val(),
							endDate: $('#ns1blankspacePayrollDashboardEndDate').val()
						})
					});

					var sContractorAccountText = ns1blankspace.option.payrollContractorAccountText;
					if (sContractorAccountText == undefined) {sContractorAccountText = 'contract'}

					var aHTML = [];
						
					ns1blankspace.financial.payroll.dashboard.data._contractorAccounts = $.grep(ns1blankspace.financial.data.accounts, function (account)
					{
						return (account.title.toLowerCase().indexOf(sContractorAccountText) != -1 && account.type == 1)
					});

					aHTML.push('<table class="ns1blankspace" style="width:100%;">');
					
					aHTML.push('<tr>' +
									'<tr><td class="ns1blankspaceSubNote">' +
									'Contacting amounts are based on expenses or payments with items linked to "' +
									$.map(ns1blankspace.financial.payroll.dashboard.data._contractorAccounts, function (account)
									{
										return account.title
									}).join(', ') + '", ' +
									' as they contain the text "' + sContractorAccountText + '".' +
									'</td></tr>');
			
					aHTML.push('</table>');					
					
					$('#ns1blankspacePayrollDashboardColumn4').html(aHTML.join(''));

					ns1blankspace.financial.payroll.dashboard.data.contractorAccounts =
							$.map(ns1blankspace.financial.payroll.dashboard.data._contractorAccounts, function (account)
							{
								return account.id
							});

					oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
					ns1blankspace.financial.payroll.dashboard.refresh(oParam);
				},			

	refresh: function (oParam, oResponse)
				{	
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sStartDate === undefined)
					{
						sStartDate = Date.today().moveToMonth(6, -1).moveToFirstDayOfMonth().toString("dd MMM yyyy");
					}

					oParam.startDate = sStartDate;

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;

					if (ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.length == 0)
					{
						ns1blankspace.financial.payroll.dashboard.employees(oParam)
					}
					else
					{
						ns1blankspace.financial.payroll.dashboard.contractor.expenses(oParam);
					}
				},

	employees: function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;

					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
						oSearch.addField('employee.contactpersontext,employee.employmentenddate,employee.statustext,employee.contactperson.firstname,employee.contactperson.surname');

						if (sStartDate != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('employee.employmentenddate', 'IS_NULL');
							oSearch.addOperator('or');
							oSearch.addFilter('employee.employmentenddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							oSearch.addBracket(')');
						}

						oSearch.rows = 999;
						oSearch.sort('employee.contactperson.firstname', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.employees(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.dashboard.data.employees = oResponse.data.rows;
						ns1blankspace.financial.payroll.dashboard.show(oParam)
					}	
				},		

	contractor:
				{
					expenses: function (oParam, oResponse)
					{
						var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
						var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

						if (oResponse == undefined)
						{
							ns1blankspace.status.working('Contractor Expenses');

							ns1blankspace.financial.payroll.dashboard.data.contractorIDs = $.map($('#ns1blankspacePayrollDashboardContractors input:checked'), function (input) {return input.id.split('-')[1]});

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('lineitem.expense.contactbusinesspaidtotext,lineitem.expense.contactbusinesspaidto,sum(amount) totalamount,sum(tax) totaltax');
							oSearch.addFilter('financialaccount', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.join(','));
							oSearch.addFilter('object', 'EQUAL_TO', 2)

							if (sStartDate != undefined)
							{
								oSearch.addFilter('lineitem.expense.accrueddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							}
								
							if (sEndDate != undefined)
							{
								oSearch.addFilter('lineitem.expense.accrueddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							}

							if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length > 0)
							{
								oSearch.addFilter('lineitem.expense.contactbusinesspaidto', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorIDs.join(','));
							}

							oSearch.rows = 9999;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.contractor.expenses(oParam, data)});	
						}
						else
						{
							$.each(oResponse.data.rows, function (r, row)
							{
								row.contactbusinesstext = row['lineitem.expense.contactbusinesspaidtotext'];
								row.contactbusiness = row['lineitem.expense.contactbusinesspaidto'];
							});

							ns1blankspace.financial.payroll.dashboard.data.contractors = oResponse.data.rows;
							ns1blankspace.financial.payroll.dashboard.data.contractorExpenses = numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totalamount).value()})).value();
							ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax = numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totaltax).value()})).value();
							ns1blankspace.financial.payroll.dashboard.contractor.payments(oParam);
						}
					},

					payments: function (oParam, oResponse)
					{
						var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
						var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

						if (oResponse == undefined)
						{
							ns1blankspace.status.working('Contractor Expenses');

							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_ITEM_SEARCH';
							oSearch.addField('lineitem.payment.contactbusinesspaidtotext,lineitem.payment.contactbusinesspaidto,sum(amount) totalamount,sum(tax) totaltax');
							oSearch.addFilter('financialaccount', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorAccounts.join(','));
							oSearch.addFilter('object', 'EQUAL_TO', 3)

							if (sStartDate != undefined)
							{
								oSearch.addFilter('lineitem.payment.paiddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							}
								
							if (sEndDate != undefined)
							{
								oSearch.addFilter('lineitem.payment.paiddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							}

							if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length > 0)
							{
								oSearch.addFilter('lineitem.payment.contactbusinesspaidto', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.contractorIDs.join(','));
							}

							oSearch.rows = 9999;
							oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.contractor.payments(oParam, data)});	
						}
						else
						{
							ns1blankspace.financial.payroll.dashboard.data.contractorExpenses = 
								ns1blankspace.financial.payroll.dashboard.data.contractorExpenses + numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totalamount).value()})).value();

							ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax = 
								ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax + numeral(_.sumBy(oResponse.data.rows, function (row) {return numeral(row.totaltax).value()})).value();

							$.each(oResponse.data.rows, function (r, row)
							{
								row.contactbusinesstext = row['lineitem.payment.contactbusinesspaidtotext'];
								row.contactbusiness = row['lineitem.payment.contactbusinesspaidto'];
							});

							ns1blankspace.financial.payroll.dashboard.data.contractors =
								_.concat(ns1blankspace.financial.payroll.dashboard.data.contractors, oResponse.data.rows);
							
							ns1blankspace.financial.payroll.dashboard.employees(oParam);
						}
					}
				},	

	payTypes:
				{
					data: {},

					init: function (oParam, oResponse)
					{
						if (oResponse == undefined)
						{
							//payrecorditem.payrecord.employee.contactpersontext
							
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
							oSearch.addField('typetext,sum(total) total');
							oSearch.sort('typetext', 'asc')
							oSearch.rows = 9999;
							oSearch.getResults(function(data){ns1blankspace.financial.payroll.dashboard.payTypes.init(oParam, data)});
						}
						else
						{
							ns1blankspace.financial.payroll.dashboard.payTypes.data.totals = oResponse.data.rows;
						}
					},

					export: function (oParam, oResponse)
					{
						var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.data.defaults.startdate}).value;
						var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.data.defaults.enddate}).value;
						var bSummary = ns1blankspace.util.getParam(oParam, 'summary', {"default": false}).value;

						bSummary = ($('#ns1blankspacePayrollDashboardEmployeesExportSummary').prop('checked')?'true':'false');

						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';

							if (bSummary)
							{
								oSearch.addField('payrecorditem.payrecord.employeetext,payrecorditem.payrecord.employee.contactpersontext,' +
											'typetext,includeinsuper,sum(total) total');
							}
							else
							{
								
								oSearch.addField('payrecorditem.payrecord.employeetext,payrecorditem.payrecord.payperiod.paydate,payrecorditem.payrecord.employee.contactpersontext,' +
											'typetext,hours,rate,total,includeinsuper,notes,standardline,standardlinetext,taxable');
							}	
							
							if (sStartDate != undefined)
							{
								oSearch.addFilter('payrecorditem.payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
								$('#ns1blankspacePayrollDashboardStartDate').val(sStartDate);
							}
								
							if (sEndDate != undefined)
							{
								oSearch.addFilter('payrecorditem.payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
								$('#ns1blankspacePayrollDashboardEndDate').val(sEndDate);
							}

							oSearch.sort('payrecorditem.payrecord.employee.contactpersontext', 'asc');

							if (!bSummary)
							{
								oSearch.sort('payrecorditem.payrecord.payperiod.paydate', 'desc');
							}

							oSearch.rows = 9999;
							oSearch.getResults(function(data){ns1blankspace.financial.payroll.dashboard.payTypes.export(oParam, data)})
						}
						else
						{
							if (bSummary)
							{
								var oFormat =
								[{
									options:
									{
										delimiter: ',',
										surroundWith: '"'
									},

									header:
									[
										{
											line: 1,
											fields:
											[
												{value: 'Number'},
												{value: 'Name'},
												{value: 'Type'},
												{value: 'Gross'}
											]
										}	
									],

									item:
									[
										{
											fields:
											[
												{field: 'payrecorditem.payrecord.employeetext'},
												{field: 'payrecorditem.payrecord.employee.contactpersontext'},
												{field: 'typetext'},
												{field: 'total'}
											]
										}		
									]
								}]
							}
							else
							{
								var oFormat =
								[{
									options:
									{
										delimiter: ',',
										surroundWith: '"'
									},

									header:
									[
										{
											line: 1,
											fields:
											[
												{value: 'Number'},
												{value: 'Name'},
												{value: 'Pay Date'},
												{value: 'Type'},
												{value: 'Hours'},
												{value: 'Rate'},
												{value: 'Gross'},
												{value: 'Included In Superannuation Calculation'},
												{value: 'Taxable'},
												{value: 'Notes'}
											]
										}	
									],


									item:
									[
										{
											fields:
											[
												{field: 'payrecorditem.payrecord.employeetext'},
												{field: 'payrecorditem.payrecord.employee.contactpersontext'},
												{field: 'payrecorditem.payrecord.payperiod.paydate'},
												{field: 'typetext'},
												{field: 'hours'},
												{field: 'rate'},
												{field: 'total'},
												{field: 'includeinsuper'},
												{field: 'taxable'},
												{field: 'notes'}
											]
										}		
									]
								}]
							}

							var sFileName = 'payroll-pay-items'
							if (bSummary) {sFileName = 'payroll-pay-items-summary'}

							if (sStartDate != undefined)
							{
								sFileName = sFileName + '-' + _.kebabCase(sStartDate)
							}
								
							if (sEndDate != undefined)
							{
								sFileName = sFileName + '_' + _.kebabCase(sEndDate)
							}

							sFileName = sFileName + '.csv'

							ns1blankspace.setup.file.export.process(
						   {
						   	items: oResponse.data.rows,
								format: oFormat,
								saveToFile: true,
								open: true,
								fileName: sFileName
							});
						}
					}
				},

	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default": ns1blankspace.financial.data.defaults.startdate}).value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.data.defaults.enddate}).value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": true}).value;

					ns1blankspace.financial.payroll.data.context = 'totals';

					if (oResponse == undefined)
					{
						ns1blankspace.status.working('Payroll');

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
						oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,payrecord.employee.id,' +
											'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate,sum(taxadjustments) taxadjustments');
						oSearch.addSummaryField('sum(grosssalary) grosssalary');
						oSearch.addSummaryField('sum(superannuation) superannuation');
						
						if (sStartDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
							$('#ns1blankspacePayrollDashboardStartDate').val(sStartDate);
						}
							
						if (sEndDate != undefined)
						{
							oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
							$('#ns1blankspacePayrollDashboardEndDate').val(sEndDate);
						}

						if ($('#ns1blankspacePayrollDashboardEmployees').length != 0)
						{
							ns1blankspace.financial.payroll.dashboard.data.employeeIDs = $.map($('#ns1blankspacePayrollDashboardEmployees input:checked'), function (input) {return input.id.split('-')[1]});
							
							if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs.length > 0)
							{
								oSearch.addFilter('payrecord.employee.id', 'IN_LIST', ns1blankspace.financial.payroll.dashboard.data.employeeIDs.join(','));
							}
						}

						oSearch.sort('payrecord.employee.contactperson', 'asc');
						oSearch.rows = 200;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.dashboard.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.status.clear();

						ns1blankspace.financial.payroll.dashboard.data.payrecords = oResponse;

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td class="ns1blankspaceHeaderCaption">PAYROLL</td></tr>' +
							
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Total Amount</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(numeral(oResponse.summary.grosssalary).value() + numeral(oResponse.summary.superannuation).value()).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Superannuation</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.superannuation).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Gross Salary</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							(oResponse.summary.grosssalary).parseCurrency().formatMoney(2, '.', ',') + 
							'</td></tr>' +		
							'<tr><td style="padding-top:12px;">' +
									'<span id="ns1blankspacePayrollDashboardEmployeesExport" style="margin-right:6px;"></span>' +
									'<span class="ns1blankspaceSubNote">As Summary <input type="checkbox" id="ns1blankspacePayrollDashboardEmployeesExportSummary" style="margin-left:4px; margin-top:12px;"></span>' +
									'<td></tr>' + 

							'<tr><td id="ns1blankspacePayrollDashboardEmployees"><td></tr>' +
							'</table>');

						$('#ns1blankspacePayrollDashboardColumn2').html(aHTML.join(''));

						var aHTML = [];

						var cSuperannuationPercentage = ns1blankspace.option.PayrollSuperannuationPercentage;
						if (cSuperannuationPercentage == undefined) {cSuperannuationPercentage = 9.5}

						var cTotalExGST = numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpenses).value() -
									numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax).value()

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td class="ns1blankspaceHeaderCaption">CONTRACTING</td></tr>' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Total including ' + ns1blankspace.option.taxVATCaption + '</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpenses).format('(0,0.00)') + 
							'</td></tr>' +	

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total ' + ns1blankspace.option.taxVATCaption + 
							'</td></tr>' +
							'<tr><td style="text-align:left;">$' +
							numeral(ns1blankspace.financial.payroll.dashboard.data.contractorExpensesTax).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td style="text-align:left; padding-top:10px;" class="ns1blankspaceCaption">Total excluding ' + ns1blankspace.option.taxVATCaption + '</td></tr>' +

							//'<br /><span class="ns1blankspaceSubNote">minus addition of nominal ' + cSuperannuationPercentage + '% for superannuation<br />for comparison to payroll.</span></td></tr>' +
							//numeral(numeral(cTotalExGST).value() - (numeral(cTotalExGST).value() * numeral(cSuperannuationPercentage/100).value())).format('(0,0.00)') + 

							'<tr><td style="text-align:left;">$' +
							numeral(numeral(cTotalExGST).value()).format('(0,0.00)') + 
							'</td></tr>' +

							'<tr><td id="ns1blankspacePayrollDashboardContractors"><td></tr>' +

							'</table>');

						//'<br /><span class="ns1blankspaceSubNote">minus addition of nominal ' + cSuperannuationPercentage + '% for superannuation<br />for comparison to payroll.</span>' +
						//numeral(numeral(cTotalExGST).value() - (numeral(cTotalExGST).value() * numeral(cSuperannuationPercentage/100).value())).format('(0,0.00)') + 

						$('#ns1blankspacePayrollDashboardColumn3').html(aHTML.join(''));

						var aHTML = [];

						if (ns1blankspace.financial.payroll.dashboard.data.employees.length < 20 && ns1blankspace.financial.payroll.dashboard.data.employees.length > 0)
						{
							aHTML.push('<table id="ns1blankspacePayrollDashboardEmployees" class="ns1blankspace" style="margin-top:16px;">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollDashboardEmployeesSelectAll"></span></td>' +
												'<td class="ns1blankspaceHeaderCaption">Employees</td>');

							$.each(ns1blankspace.financial.payroll.dashboard.data.employees, function (e, employee)
							{
								aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceDashboardEmployees_container-' + employee.id + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceDashboardEmployees_selectContainer-' + employee.id + '">' +
													'<input type="checkbox" id="ns1blankspaceDashboardEmployees_select-' + employee.id + '" /></td>');

								aHTML.push('<td id="ns1blankspaceDashboardEmployees_employee" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													(employee["employee.contactperson.firstname"] != ''?'<div>' + employee["employee.contactperson.firstname"] + '</div>':'') +
													'<div>' + employee["employee.contactperson.surname"] + '</div>' +
													'</td></tr>');
							});

							aHTML.push('</table>');

							$('#ns1blankspacePayrollDashboardEmployees').html(aHTML.join(''));

							if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs == undefined)
							{
								$('#ns1blankspacePayrollDashboardEmployees input').prop('checked', true);
							}
							else if (ns1blankspace.financial.payroll.dashboard.data.employeeIDs.length == 0)
							{
								$('#ns1blankspacePayrollDashboardEmployees input').prop('checked', true);
							}
							else
							{
								$.each(ns1blankspace.financial.payroll.dashboard.data.employeeIDs, function (i, sID)
								{
									$('#ns1blankspaceDashboardEmployees_select-' + sID).prop('checked', true);
								});	
							}

							$('.ns1blankspacePayrollDashboardEmployeesSelectAll').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-check"
								}
							})
							.click(function()
							{	
								$('#ns1blankspacePayrollDashboardEmployees input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
							})
							.css('width', '14px');
						}

						$('#ns1blankspacePayrollDashboardEmployeesExport').button(
						{
							label: 'Export'
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.dashboard.payTypes.export(oParam);
						});	

						var aHTML = [];

						if (ns1blankspace.financial.payroll.dashboard.data.contractors.length < 20 && ns1blankspace.financial.payroll.dashboard.data.contractors.length > 0)
						{
							aHTML.push('<table id="ns1blankspacePayrollDashboardContractors" class="ns1blankspace" style="margin-top:16px;">' +
												'<tr class="ns1blankspaceCaption">' +
												'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollDashboardContractorsSelectAll"></span></td>' +
												'<td class="ns1blankspaceHeaderCaption">Contractors</td>');

							$.each(ns1blankspace.financial.payroll.dashboard.data.contractors, function (c, contractor)
							{
								aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspaceDashboardContractors_container-' + contractor.contactbusiness + '">' +
													'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspaceDashboardContractors_selectContainer-' + contractor.contactbusiness + '">' +
													'<input type="checkbox" id="ns1blankspaceDashboardContractors_select-' + contractor.contactbusiness + '" /></td>');

								aHTML.push('<td id="ns1blankspaceDashboardContractors_business" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
													'<div>' + contractor["contactbusinesstext"] + '</div>' +
													'</td></tr>');
							});

							aHTML.push('</table>');

							$('#ns1blankspacePayrollDashboardContractors').html(aHTML.join(''));

							if (ns1blankspace.financial.payroll.dashboard.data.contactorIDs == undefined)
							{
								$('#ns1blankspacePayrollDashboardContractors input').prop('checked', true);
							}
							else if (ns1blankspace.financial.payroll.dashboard.data.contractorIDs.length == 0)
							{
								$('#ns1blankspacePayrollDashboardContractors input').prop('checked', true);
							}
							else
							{
								$.each(ns1blankspace.financial.payroll.dashboard.data.contractorIDs, function (i, sID)
								{
									$('#ns1blankspaceDashboardContractors_select-' + sID).prop('checked', true);
								});	
							}

							$('.ns1blankspacePayrollDashboardContractorsSelectAll').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-check"
								}
							})
							.click(function()
							{	
								$('#ns1blankspacePayrollDashboardContractors input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
							})
							.css('width', '14px');	
						}
					}	
				}
}

ns1blankspace.financial.payroll.util.superannuation =
{
	data: {},

	init: function (oParam, oResponse)
	{
		ns1blankspace.financial.payroll.util.superannuation.pays()
	},

	pays: function (oParam, oResponse)
	{
		var iPeriodID = ns1blankspace.util.getParam(oParam, 'period', {"default": ns1blankspace.objectContext});

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
			oSearch.addField('payrecord.employee.supercontactbusiness,payrecord.employee.contactperson,payrecord.employee.employeenumber,payrecord.employee.contactperson.firstname,payrecord.employee.contactperson.surname,payrecord.employee.id,superannuation,payrecord.employee.superannuationrate');
			oSearch.addFilter('period', 'EQUAL_TO', ns1blankspace.objectContext)
			oSearch.rows = 200;
			oSearch.sort('id', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.pays(oParam, data)})	
		}
		else
		{
			ns1blankspace.financial.payroll.util.superannuation.data.pays = oResponse.data.rows;
			ns1blankspace.financial.payroll.util.superannuation.data.payIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.pays, function(pay) {return pay.id});

			ns1blankspace.financial.payroll.util.superannuation.expenses()
		}
	},

	expenses: function (oParam, oResponse)
	{
		var iFinancialAccountSuperannuationID = ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation;

		if (ns1blankspace.financial.payroll.util.superannuation.data.payIDs.length != 0)
		{
			if (oResponse == undefined )
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
				oSearch.addField('reference,amount');
				oSearch.addFilter('object', 'EQUAL_TO', 37);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.rows = 9999;
				oSearch.sort('objectcontext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.expenses(oParam, data)})	
			}
			else
			{
				ns1blankspace.financial.payroll.util.superannuation.data.expenses = oResponse.data.rows;
				ns1blankspace.financial.payroll.util.superannuation.data.expenseIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.expenses, function(expense) {return expense.id})
				if (ns1blankspace.financial.payroll.util.superannuation.data.expenses.length == 0)
				{
					console.log('! No Expenses');
				}
				else
				{
					ns1blankspace.financial.payroll.util.superannuation.financialItems();
				}	
			}
		}	
	},

	financialItems: function (oParam, oResponse)
	{
		var iFinancialAccountSuperannuationID = ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation;

		if (ns1blankspace.financial.payroll.util.superannuation.data.payIDs.length != 0)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_ITEM_SEARCH';
				oSearch.addField('otherobject,otherobjectcontext,amount,description,object,objectcontext,financialaccount,tax,taxtype');
				//oSearch.addFilter('otherobject', 'EQUAL_TO', 131);
				oSearch.addFilter('object', 'EQUAL_TO', 2);
				oSearch.addFilter('objectcontext', 'IN_LIST', ns1blankspace.financial.payroll.util.superannuation.data.expenseIDs.join(','));
				oSearch.addFilter('financialaccount', 'EQUAL_TO', iFinancialAccountSuperannuationID);
				oSearch.rows = 9999;
				oSearch.sort('otherobjectcontext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.financial.payroll.util.superannuation.financialItems(oParam, data)})	
			}
			else
			{
				ns1blankspace.financial.payroll.util.superannuation.data.financialItems = oResponse.data.rows;
				ns1blankspace.financial.payroll.util.superannuation.data.financialItemsIDs = $.map(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function(item) {return item.id});
				ns1blankspace.financial.payroll.util.superannuation.process();	
			}
		}	
	},

	process: function (oParam, oResponse)
	{
		var bShow = ns1blankspace.util.getParam(oParam, 'show', {"default": true}).value;
	

		$.each(ns1blankspace.financial.payroll.util.superannuation.data.pays, function (p, pay)
		{
			pay._item = $.grep(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function (item)
			{
				var sPayDescription = 'Superannuation for ' + pay['payrecord.employee.contactperson.firstname'] + ' ' + pay['payrecord.employee.contactperson.surname'] + ' -'
				return (_.includes(item['description'], sPayDescription))
			})[0];

			pay._items = $.grep(ns1blankspace.financial.payroll.util.superannuation.data.financialItems, function (item)
			{
				var sPayDescription = 'Superannuation for ' + pay['payrecord.employee.contactperson.firstname'] + ' ' + pay['payrecord.employee.contactperson.surname'] + ' -'
				return (_.includes(item['description'], sPayDescription))
			});

			pay.superannuationpaid = 0;

			if (pay._item != undefined)
			{
				pay.superannuationpaid = _.sumBy(pay._items, function (item) {return numeral(item.amount).value()});
			}

			pay.superannuationdue = numeral(pay.superannuation).value();
			pay.superannuationtopay = pay.superannuationdue - pay.superannuationpaid;
		});

		ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay =
			$.grep(ns1blankspace.financial.payroll.util.superannuation.data.pays, function(pay) {return pay.superannuationtopay != 0});

		if (bShow)
		{
			console.log(ns1blankspace.financial.payroll.util.superannuation.data);
			ns1blankspace.financial.payroll.util.superannuation.show()
		}	
	},

	show: function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMainExpenses'}).value;

		var aHTML = [];

		aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspacePayrollSuperCheckColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspacePayrollSuperCheckColumn2" style="width:105px;"></td>' +
							'</tr></table>');				
										
		$('#' + sXHTMLElementID).html(aHTML.join(''));

		var aHTML = [];

		if (ns1blankspace.financial.payroll.util.superannuation.data != undefined)
		{
			aHTML.push('<table class="ns1blankspaceColumn2" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceSubNote">Pays with superannuation non-matching expenses</td></tr>' +
							'<tr><td style="text-align:left;">' +
							numeral(ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay.length).format('(0,0)') + 
							'</td></tr>' +
							'<tr><td style="padding-top:10px;"><span id="ns1blankspacePayrollSuperCheckCreateExpenses" class="ns1blankspaceAction" style="text-align:left;">' +
									'Create Expenses</span></td></tr>' +
							'</table>');
		}	

		$('#ns1blankspacePayrollSuperCheckColumn2').html(aHTML.join(''));

		$('#ns1blankspacePayrollSuperCheckCreateExpenses').button(
		{
			text: 'Create All Expenses',
			icons: false
		})
		.click(function()
		{
			ns1blankspace.financial.payroll.util.superannuation.create.expenses({next: true});
		})
		.css('width', '80px');

		var aHTML = [];

		if (ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay.length == 0 )
		{
			aHTML.push('<table><tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No pays</td>' +
							'</tr></table>');

			$('#ns1blankspacePayrollSuperCheckColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table id="ns1blankspacePayrollSuperCheck" class="ns1blankspace">' +
							'<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceHeaderCaption">First Name</td>' +
							'<td class="ns1blankspaceHeaderCaption">Last Name</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="color:#A0A0A0;">Number</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Superannuation</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">To Be Paid</td>' +
							'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
							'</tr>');
			
			$(ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay).each(function(r, oRow) 
			{
				var sKey = oRow.id;

				aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollSuperCheck_container-' + sKey + '">')

				aHTML.push('<td id="ns1blankspacePayrollPayTotals_firstname" class="ns1blankspaceRow">' +
								oRow["payrecord.employee.contactperson.firstname"] + '</td>');

				aHTML.push('<td id="ns1blankspacePayrollPayTotals_surname" class="ns1blankspaceRow">' +
								oRow["payrecord.employee.contactperson.surname"] + '</td>');

				aHTML.push('<td id="ns1blankspacePayrollPayTotals_employeenumber" class="ns1blankspaceRow ns1blankspaceSub">' +
								oRow["payrecord.employee.employeenumber"] + '</td>');

				aHTML.push('<td id="ns1blankspacePayrollPayTotals_employeenumber" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
								oRow["superannuation"] + '</td>');

				aHTML.push('<td id="ns1blankspacePayrollPayTotals_employeenumber" class="ns1blankspaceRow" style="text-align:right;">' +
								numeral(oRow["superannuationtopay"]).format('(0,0.00)') + '</td>');

				if (numeral(oRow["superannuationtopay"]).value() > 0)
				{
					aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
								'<span style="margin-right:5px;" id="ns1blankspacePayrollCheckSuper_option_createexpense-' + sKey + '"' +
												' class="ns1blankspaceRowCreateExpense"></span>' +		
								'</td></tr>');
				}
				else if (oRow._item != undefined)
				{
					sKey = oRow._item.objectcontext;

					aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">' +
								'<span style="margin-right:5px;" id="ns1blankspacePayrollCheckSuper_option_deleteexpense-' + sKey + '"' +
												' class="ns1blankspaceRowDeleteExpense"></span>' +		
								'</td></tr>');
				}
				else
				{
					aHTML.push('<td style="width:20px;text-align:right;" class="ns1blankspaceRow">&nbsp;</td>')
				}
			});

			aHTML.push('</table>')

			$('#ns1blankspacePayrollSuperCheckColumn1').html(aHTML.join(''));

			$('#ns1blankspacePayrollSuperCheck span.ns1blankspaceRowCreateExpense').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-check"
				}
			})
			.click(function()
			{
				ns1blankspace.financial.payroll.util.superannuation.create.expense({id: (this.id).split('-')[1]});
			})
			.css('width', '15px')
			.css('height', '20px');

			$('#ns1blankspacePayrollSuperCheck span.ns1blankspaceRowDeleteExpense').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-close"
				}
			})
			.click(function()
			{
				ns1blankspace.financial.payroll.util.superannuation.delete.expense({id: (this.id).split('-')[1]});
			})
			.css('width', '15px')
			.css('height', '20px');
		}	
	},

	delete:
	{
		expense: function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'id').value;

			if (oResponse == undefined)
			{
				var oData =
				{
					id: iID,
					remove: 1
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_EXPENSE_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.status.message('Expense deleted');
						$('#ns1blankspacePayrollCheckSuper_option_deleteexpense-' + iID).remove();
					}
				});
			}
		}
	},

	create:
	{
		expense: function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'id').value;
			var bNext = ns1blankspace.util.getParam(oParam, 'next', {"default": false}).value;
			var iExpenseIndex = ns1blankspace.util.getParam(oParam, 'expenseIndex', {"default": 0}).value;

			var oPay = $.grep(ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay, function (pay) {return pay.id == iID})[0];

			if (oPay != undefined)
			{
				if (oPay.superannuationtopay > 0)
				{
					ns1blankspace.status.working();

					if (oPay._item != undefined)
					{
						var oData =
						{
							object: oPay._item.object,
							objectcontext: oPay._item.objectcontext,
							amount: oPay.superannuationtopay,
							financialaccount: oPay._item.financialaccount,
							otherobject: 131,
							otherobjectcontext: oPay['payrecord.employee.id'],
							taxtype: 5
						}

						oData.description = 'Superannuation for ' + oPay['payrecord.employee.contactperson.firstname'] + ' ' +
													oPay['payrecord.employee.contactperson.surname'] + ' - ' + ns1blankspace.objectContextData.paydate + ' (Adjustment)'

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.status.message('Expense item created');
								$('#ns1blankspacePayrollCheckSuper_option_createexpense-' + oPay.id).remove();

								if (bNext)
								{
									oParam = ns1blankspace.util.setParam(oParam, 'expenseIndex', iExpenseIndex + 1);
									ns1blankspace.financial.payroll.util.superannuation.create.expenses(oParam);
								}
							}
						});
					}
					else
					{		
						var oBankAccount = $.grep(ns1blankspace.financial.data.bankaccounts, function (ba) {return ba.defaultpaymentaccount == 'Y'})[0];

						var iContactBusiness = oPay['payrecord.employee.supercontactbusiness'];
						if (iContactBusiness == '') {iContactBusiness = ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness}

						var oData =
						{
							accrueddate: ns1blankspace.objectContextData.paydate,
							contactbusinesspaidto: iContactBusiness,
							object: 37,
							objectcontext: ns1blankspace.objectContext,
							paystatus: 1
						}

						oData.description = 'Superannuation for ' + oPay['payrecord.employee.contactperson.firstname'] + ' ' +
													oPay['payrecord.employee.contactperson.surname'] + ' - ' + ns1blankspace.objectContextData.paydate;

						if (oBankAccount != undefined)
						{
							oData.bankaccount = oBankAccount.id
						}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('FINANCIAL_EXPENSE_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(oResponse)
							{
								var oData =
								{
									object: 2,
									objectcontext: oResponse.id,
									amount: oPay.superannuationtopay,
									financialaccount: ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation,
									otherobject: 131,
									otherobjectcontext: oPay['payrecord.employee.id'],
									taxtype: 5
								}

								oData.description = 'Superannuation for ' + oPay['payrecord.employee.contactperson.firstname'] + ' ' +
															oPay['payrecord.employee.contactperson.surname'] + ' - ' + ns1blankspace.objectContextData.paydate + ' (Adjustment)'

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function(data)
									{
										ns1blankspace.status.message('Expense item created');
										$('#ns1blankspacePayrollCheckSuper_option_createexpense-' + oPay.id).remove();
										if (bNext)
										{
											oParam = ns1blankspace.util.setParam(oParam, 'expenseIndex', iExpenseIndex + 1);
											ns1blankspace.financial.payroll.util.superannuation.create.expenses(oParam);
										}
									}
								});
							}
						});
					}								
				}
				else
				{
					if (bNext)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'expenseIndex', iExpenseIndex + 1);
						ns1blankspace.financial.payroll.util.superannuation.create.expenses(oParam);
					}
					else
					{
						ns1blankspace.status.error('Superannuation alread overpaid.')
					}
				}							
			}
		},

		expenses: function (oParam, oResponse)
		{
			var iExpenseIndex = ns1blankspace.util.getParam(oParam, 'expenseIndex', {"default": 0}).value;

			if (iExpenseIndex < ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay.length)
			{
				ns1blankspace.financial.payroll.util.superannuation.create.expense(
				{
					id: ns1blankspace.financial.payroll.util.superannuation.data.paysSuperannuationToPay[iExpenseIndex].id,
					next: true,
					expenseIndex: iExpenseIndex
				});
			}
			else
			{
				ns1blankspace.status.message('Done')
			}
		}
	}
} 


ns1blankspace.financial.payroll.leave =
{
	show: 	function (oParam, oResponse)
				{
					var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
					var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default": ns1blankspace.financial.data.defaults.enddate}).value;
					var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod').value;
					
					if (oParam == undefined)
					{	
						oParam = {}
					}	

					if (sEndDate === undefined)
					{
						sEndDate = Date.today().toString("dd MMM yyyy");
					}

					oParam.endDate = sEndDate;
					
					ns1blankspace.financial.payroll.data.startDate = sStartDate;
					ns1blankspace.financial.payroll.data.endDate = sEndDate;
					ns1blankspace.financial.payroll.data.payPeriodID = iPayPeriod;

					ns1blankspace.financial.payroll.data.context = 'leave';

					if (oResponse == undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
								'<tr>' +
								'<td id="ns1blankspacePayrollLeaveColumn1" class="ns1blankspaceColumn1Divider" style="width:120px; font-size: 0.875em; padding-right:10px;"></td>' +
								'<td id="ns1blankspacePayrollLeaveColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
								'</tr>' +
								'</table>');	

						$('#ns1blankspaceMainLeave').html(aHTML.join(''));	

						var aHTML = [];
						
						aHTML.push('<table>');
						
						aHTML.push('<tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollStartDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
							
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
										'To' +
										'</td></tr>' +
										'<tr><td class="ns1blankspaceDate">' +
										'<input id="ns1blankspacePayrollEndDate" data-1blankspace="ignore" class="ns1blankspaceDate">' +
										'</td></tr>');
														
						aHTML.push('<tr><td style="padding-top:5px;">' +
										'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspacePayrollLeaveRefresh">Refresh</span>' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:15px;" id="ns1blankspacePayrollLeaveSummary">' +
										'</td></tr>');
						
						aHTML.push('</table>');					
						
						$('#ns1blankspacePayrollLeaveColumn1').html(aHTML.join(''));

						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

						$('#ns1blankspacePayrollLeaveRefresh').button(
						{
							label: 'Refresh'
						})
						.click(function()
						{
							ns1blankspace.financial.payroll.leave.show(
							{
								startDate: $('#ns1blankspacePayrollStartDate').val(),
								endDate: $('#ns1blankspacePayrollEndDate').val()
							})
						});

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_LEAVE_SEARCH';
						oSearch.addField('payemployeeleave.employee.id,payemployeeleave.employee.contactpersontext,payemployeeleave.employee.employeenumber,' +
											'type,sum(hours) hours');
						oSearch.addSummaryField('sum(hours) hours');

						if (sStartDate == undefined) {sStartDate = ''}
						if (sEndDate == undefined) {sEndDate = ''}
						
						if (sStartDate != '' || sEndDate != '')
						{
							oSearch.addBracket('(');

							if (sStartDate != '')
							{
								oSearch.addFilter('payemployeeleave.period.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)
								$('#ns1blankspacePayrollStartDate').val(sStartDate);
							}
								
							if (sEndDate != '')
							{
								oSearch.addFilter('payemployeeleave.period.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)
								$('#ns1blankspacePayrollEndDate').val(sEndDate);
							}

							oSearch.addBracket(')');
							oSearch.addOperator('or');
							oSearch.addFilter('payemployeeleave.period.paydate', 'IS_NULL')
						}

						oSearch.addFilter('payemployeeleave.employee.id', 'IS_NOT_NULL');
						oSearch.addFilter('type', 'IS_NOT_NULL');

						oSearch.sort('payemployeeleave.employee.contactpersontext', 'asc');
						oSearch.rows = 9999;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.leave.show(oParam, data)});	
					}
					else
					{
						ns1blankspace.financial.payroll.data.leave = oResponse;

						var aLeaveAnnual = _.map(_.filter(oResponse.data.rows, function (oRow) {return oRow.type == 1}), function (oRow) {return oRow.hours});
						var cLeaveAnnual = _.sumBy(aLeaveAnnual, function (cLeaveAnnual) {return numeral(cLeaveAnnual).value()});

						var aLeaveSick = _.map(_.filter(oResponse.data.rows, function (oRow) {return oRow.type == 2}), function (oRow) {return oRow.hours});
						var cLeaveSick = _.sumBy(aLeaveSick, function (cLeaveSick) {return numeral(cLeaveSick).value()});

						var aLeaveLongService = _.map(_.filter(oResponse.data.rows, function (oRow) {return oRow.type == 3}), function (oRow) {return oRow.hours});
						var cLeaveLongService = _.sumBy(aLeaveLongService, function (cLeaveLongService) {return numeral(cLeaveLongService).value()});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace" style="width:100%;">' +
							'<tr><td style="text-align:left;" class="ns1blankspaceCaption"><div>Total</div><div class="ns1blankspaceSubNote">hours</div></td></tr>' +
							'<tr><td style="text-align:left; padding-left:2px; padding-top:0px;">' +
							(oResponse.summary.hours).parseCurrency().formatMoney(2, '.', ',') + '' +
							'</td></tr>' +

							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Annual</td></tr>' +
							'<tr><td style="text-align:left; padding-left:2px; padding-top:0px;">' +
							numeral(cLeaveAnnual).format('(0,0.00)') +
							'</td></tr>' +

							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Sick</td></tr>' +
							'<tr><td style="text-align:left; padding-left:2px; padding-top:0px;">' +
							numeral(cLeaveSick).format('(0,0.00)') +
							'</td></tr>' +

							'<tr><td style="text-align:left;" class="ns1blankspaceCaption">Long Service</td></tr>' +
							'<tr><td style="text-align:left; padding-left:2px; padding-top:0px;">' +
							numeral(cLeaveLongService).format('(0,0.00)') +
							'</td></tr>' +

							'</table>');

						$('#ns1blankspacePayrollLeaveSummary').html(aHTML.join(''));

						ns1blankspace.financial.payroll.leave.employees.show(oParam);
					}	
				},

	employees: 	
				{
					show: 	function (oParam, oResponse)
								{
									var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
									var iPayPeriod = ns1blankspace.util.getParam(oParam, 'payPeriod').value;
									var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;

									if (oResponse == undefined)
									{
										ns1blankspace.financial.data.employee = [];

										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">' +
														'<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspacePayrollEmployeeLeaveColumn1">' + ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspacePayrollEmployeeLeaveColumn2" style="width:95px;"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspacePayrollLeaveColumn2').html(aHTML.join(''));

										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
										oSearch.addField('employee.employmentstartdate,employee.employmentenddate,employee.statustext,employee.employeenumber,' +
															'employee.contactperson,employee.contactperson.firstname,employee.contactperson.surname,employee.contactperson.email,' +
															'employee.terminationtype,employee.terminationtypetext,employee.status,employee.taxtreatmentcode');

										if (!bShowAll)
										{
											oSearch.addFilter('status', 'EQUAL_TO', 2);
										}
						
										oSearch.rows = 9999;
										oSearch.sort('employee.employeenumber', 'asc');
										oSearch.sort('employee.contactperson.firstname', 'asc');
										oSearch.sort('employee.contactperson.surname', 'asc');
										oSearch.getResults(function(data) {ns1blankspace.financial.payroll.leave.employees.show(oParam, data)});
									}
									else
									{
										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr class="ns1blankspace">' +
															'<td class="ns1blankspaceNothing">No employees</td>' +
															'</tr></table>');

											$('#ns1blankspacePayrollEmployeeLeaveColumn1').html(aHTML.join(''));
										}
										else
										{
											ns1blankspace.financial.payroll.data.employees = oResponse.data.rows;
											ns1blankspace.financial.payroll.data.employeeLeave = [];

											aHTML.push('<table id="ns1blankspacePayrollEmployeeLeave" class="ns1blankspace">' +
															'<tr class="ns1blankspaceCaption">' +
															'<td class="ns1blankspaceHeaderCaption">Employee</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em; width:100px;">Annual</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em; width:100px;">Sick</td>' +
															'<td class="ns1blankspaceHeaderCaption" style="text-align:right; font-size:1em; width:120px;">Long Service</td>' +
															'</tr>');
											
											$(oResponse.data.rows).each(function() 
											{
												aHTML.push(ns1blankspace.financial.payroll.leave.employees.row(this));
											});
											
											aHTML.push('</table>');

											ns1blankspace.render.page.show(
										   {
												type: 'JSON',
												xhtmlElementID: 'ns1blankspacePayrollEmployeeLeaveColumn1',
												xhtmlContext: 'EmployeesLeave',
												xhtml: aHTML.join(''),
												showMore: (oResponse.morerows == "true"),
												more: oResponse.moreid,
												rows: 200,
												functionShowRow: ns1blankspace.financial.payroll.leave.employees.row,
												functionOpen: undefined,
												functionOnNewPage: ns1blankspace.financial.payroll.leave.employees.bind,
										   });

											var aHTML = [];
																	
											aHTML.push('<table class="ns1blankspaceColumn2" style="margin-right:0px;">');
				
											aHTML.push('<tr>' +
															'<td class="ns1blankspaceSubNote" style="padding-top:10px;">' +
															'Export leave as</td></tr>');
											
											aHTML.push('<tr><td style="padding-top:4px;"><span id="ns1blankspacePayrollLeaveDownload" class="ns1blankspaceAction">' +
															'CSV</span></td></tr>');


											aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-top:12px; cursor:pointer;"' +
																' id="ns1blankspacePayrollLeaveShowAll">Show ' +
																(bShowAll?'only active employees':'all employees') +
																'</td></tr>');

											aHTML.push('</table>');					
											
											$('#ns1blankspacePayrollEmployeeLeaveColumn2').html(aHTML.join(''));

											$('#ns1blankspacePayrollLeaveShowAll').click(function()
											{
												oParam.showAll = !bShowAll;
												ns1blankspace.financial.payroll.leave.employees.show(oParam);
											});
											
											$('#ns1blankspacePayrollLeaveDownload').button(
											{
												label: 'CSV'
											})
											.click(function()
											{	
												var oFormat =
												[{
													options:
													{
														delimiter: ',',
														surroundWith: '"'
													},

													header:
													[
														{
															line: 1,
															fields:
															[
																{value: 'Employee Name'},
																{value: 'Employee Number'},
																{value: 'Employee Start Date'},
																{value: 'Employee End Date'},
																{value: 'Employee Status'},
																{value: 'Annual Leave (Hours)'},
																{value: 'Sick Leave (Hours)'},
																{value: 'Long Service Leave (Hours)'}
															]
														}	
													],

													item:
													[
														{
															fields:
															[
																{field: 'name'},
																{field: 'employee.employeenumber'},
																{field: 'employee.employmentstartdate'},
																{field: 'employee.employmentenddate'},
																{field: 'employee.statustext'},
																{field: 'leaveAnnual'},
																{field: 'leaveLongService'},
																{field: 'leaveSick'}
															]
														}		
													]
												}]

												var sFileName = 'payroll-employee-leave.csv'

												ns1blankspace.setup.file.export.process(
											   {
											   	items: ns1blankspace.financial.payroll.data.employeeLeave,
													format: oFormat,
													saveToFile: true,
													open: true,
													fileName: sFileName
												});
											})
											.css('width', '90px');
										}	    	
									}
								},

					row: 		function (oRow, oParam)
								{
									var sChecked;
									var sKey = oRow.id;									
									var aHTML = [];
									var oEmployeeLeave;

									var aLeave = _.filter(ns1blankspace.financial.payroll.data.leave.data.rows,
															function (leave) {return leave['payemployeeleave.employee.id'] == oRow['id']});

									if (aLeave.length == 0 && oRow["employee.statustext"] == 'Inactive')
									{}
									else
									{	
										var oLeaveType;

										oEmployeeLeave	= oRow;
										oEmployeeLeave._leave = aLeave;
										oEmployeeLeave.leaveAnnual = 0;
										oEmployeeLeave.leaveSick = 0;
										oEmployeeLeave.leaveLongService = 0;

										if (aLeave.length != 0)
										{
											oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 1});
											if (oLeaveType != undefined) {oEmployeeLeave.leaveAnnual = oLeaveType.hours};

											oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 2});
											if (oLeaveType != undefined) {oEmployeeLeave.leaveSick = oLeaveType.hours};

											oLeaveType = _.find(aLeave, function (oLeave) {return oLeave.type == 3});
											if (oLeaveType != undefined) {oEmployeeLeave.leaveLongService = oLeaveType.hours};
										}

										oEmployeeLeave.name = oEmployeeLeave["employee.contactperson.firstname"] + ' ' + oEmployeeLeave["employee.contactperson.surname"];

										ns1blankspace.financial.payroll.data.employeeLeave.push(oEmployeeLeave);

										aHTML.push('<tr class="ns1blankspaceRow" id="ns1blankspacePayrollTotals_container-' + sKey + '">');
																	
										aHTML.push('<td id="ns1blankspacePayrollLeave_employee" class="ns1blankspaceRow"><div>' +
													(oEmployeeLeave["employee.contactperson.firstname"] != ''?oEmployeeLeave["employee.contactperson.firstname"] + ' ':'') +
													oEmployeeLeave["employee.contactperson.surname"] + '</div>' +
													'<div class="ns1blankspaceSub">' + oEmployeeLeave["employee.employeenumber"] + '</div>' + 
													'</td>');

										aHTML.push('<td class="ns1blankspaceRow" style="text-align:right;">' +
											 					(oEmployeeLeave.leaveAnnual==0?'<span class="ns1blankspaceSub">0.00</span>':numeral(oEmployeeLeave.leaveAnnual).format('(0,0.00)')) + '</td>');

										aHTML.push('<td class="ns1blankspaceRow" style="text-align:right;">' +
											 					(oEmployeeLeave.leaveAnnual==0?'<span class="ns1blankspaceSub">0.00</span>':numeral(oEmployeeLeave.leaveSick).format('(0,0.00)')) + '</td>');	

										aHTML.push('<td class="ns1blankspaceRow" style="text-align:right;">' +
											 					(oEmployeeLeave.leaveAnnual==0?'<span class="ns1blankspaceSub">0.00</span>':numeral(oEmployeeLeave.leaveLongService).format('(0,0.00)')) + '</td>');			
					
										aHTML.push('</tr>');
										
										return aHTML.join('');
									}
								},

					bind: 	function ()
								{
									$('#ns1blankspacePayrollEmployeeLeave .ns1blankspaceRowSelect')
									.click(function()
									{
										$('#ns1blankspaceViewControlNew').button({disabled: false});
										ns1blankspace.show({selector: '#ns1blankspaceMainEmployee', refresh: true});
										ns1blankspace.financial.payroll.employees.show({filterEmployee: (this.id).split('-')[1]});	
									})
									.css('width', '15px')
									.css('height', '20px');

									$('.ns1blankspacePayrollEmployeeLeaveSelectAll').button(
									{
										text: false,
										icons:
										{
											primary: "ui-icon-check"
										}
									})
									.click(function()
									{	
										$('#ns1blankspacePayrollEmployeeTotals input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
									})
									.css('width', '14px');		
								}
				}				
}



